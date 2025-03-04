// nest
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';

// schema
import User from 'src/users/user.schema';

// dto's
import { CreateUserDto, SignInDto } from 'src/users/dto';
import { SignInPresenter, SignUpPresenter } from './dto';

// utils
import { hashPassword, verifyPassword } from './utils/passwordUtils';

// types
import { ITokens } from './auth.types';
import { IUser } from 'src/users/user.types';

// config
import { config } from '../config';

// constants
import { confirmationMail, sendMail, vocabulary } from 'src/shared';

const {
  auth: {
    WRONG_PASSWORD,
    USER_IS_NOT_ACTIVE,
    USER_IS_ACTIVATED,
    USER_ALREADY_ACTIVATED,
    LINK_EXPIRED,
    INVALID_TOKEN,
  },
  users: { USER_NOT_FOUND: NOT_FOUND, ALREADY_EXISTS },
} = vocabulary;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) readonly userModel: typeof User,
    readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto): Promise<SignUpPresenter> {
    const user = await this.userModel.scope('withPassword').findOne({
      where: { email: signUpDto.email },
    });

    if (user) {
      throw new BadRequestException(ALREADY_EXISTS);
    }

    const userAttributes = {
      ...signUpDto,
      password: await hashPassword(signUpDto.password),
    };

    const createdUser = await this.userModel.create(userAttributes);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...userWithoutPassword } = createdUser.dataValues;

    const token = this.jwtService.sign(userWithoutPassword, {
      secret: config.SECRET_CONFIRM,
      expiresIn: config.EXPIRES_IN_CONFIRM,
    });

    const message = confirmationMail(token, userWithoutPassword.firstName);

    await sendMail([userWithoutPassword.email], 'Confirm your email', message);

    return userWithoutPassword;
  }

  async signIn(signInDto: SignInDto): Promise<SignInPresenter> {
    const { password, email } = signInDto;

    const user = await this.userModel.scope('withPassword').findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    if (!user.active) {
      throw new BadRequestException(USER_IS_NOT_ACTIVE);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photo, ...userWithoutPhoto } = user.dataValues;

    const match = await verifyPassword(password, user.password);
    if (!match) {
      throw new BadRequestException(WRONG_PASSWORD);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...userWithoutPassword } = user.dataValues;

    const { accessToken, refreshToken } = this.generateTokens(userWithoutPhoto);

    return new SignInPresenter(userWithoutPassword, accessToken, refreshToken);
  }

  async refresh(id: string): Promise<ITokens | void> {
    const user = await this.userModel.scope('withPassword').findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { photo, ...userWithoutPhoto } = user.dataValues;
    if (userWithoutPhoto) {
      return this.generateTokens(userWithoutPhoto);
    }
  }

  async confirmUser(token: string): Promise<{ message: string }> {
    let email: string;

    try {
      ({ email } = this.jwtService.verify(token, {
        secret: config.SECRET_CONFIRM,
      }));
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException(LINK_EXPIRED);
      }
      throw new BadRequestException(INVALID_TOKEN);
    }

    const user = await this.userModel.scope('withPassword').findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    if (user.active) {
      throw new BadRequestException(USER_ALREADY_ACTIVATED);
    }

    await this.userModel.update({ active: true }, { where: { id: user.id } });

    return { message: USER_IS_ACTIVATED };
  }

  generateTokens(user: Partial<IUser>): ITokens {
    const accessToken = this.jwtService.sign(user, {
      secret: config.SECRET_ACCESS,
      expiresIn: config.EXPIRES_IN,
    });
    const refreshToken = this.jwtService.sign(user, {
      secret: config.SECRET_REFRESH,
      expiresIn: config.EXPIRES_IN_REFRESH,
    });
    return { accessToken, refreshToken };
  }
}

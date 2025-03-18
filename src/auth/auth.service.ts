import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/user.schema';

import { CreateUserDto, SignInDto } from 'src/users/dto';
import { SignInPresenter, SignUpPresenter } from './dto';

import { hashPassword, verifyPassword } from './utils/passwordUtils';

import { ITokens } from './auth.types';
import { IUser } from 'src/users/user.types';

import { config } from '../config';

import { /* confirmationMail, sendMail, */ vocabulary } from 'src/shared';

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
    @Inject(User) readonly userModel: typeof User,
    readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: CreateUserDto): Promise<SignUpPresenter> {
    const user = await this.userModel.findOne({
      email: signUpDto.email,
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
    const { password: p, ...userWithoutPassword } = createdUser;

    /* const token = this.jwtService.sign(userWithoutPassword, {
      secret: config.SECRET_CONFIRM,
      expiresIn: config.EXPIRES_IN_CONFIRM,
    }); */

    // const message = confirmationMail(token, userWithoutPassword.firstName);

    //await sendMail([userWithoutPassword.email], 'Confirm your email', message);

    return userWithoutPassword;
  }

  async signIn(signInDto: SignInDto): Promise<SignInPresenter> {
    const { password, email } = signInDto;

    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    if (!user.active) {
      throw new BadRequestException(USER_IS_NOT_ACTIVE);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const match = await verifyPassword(password, user.password);
    if (!match) {
      throw new BadRequestException(WRONG_PASSWORD);
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return new SignInPresenter(user, accessToken, refreshToken);
  }

  async refresh(_id: string): Promise<ITokens | void> {
    const user = await this.userModel.findOne({
      _id,
    });
    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    return this.generateTokens(user);
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

    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    if (user.active) {
      throw new BadRequestException(USER_ALREADY_ACTIVATED);
    }

    await this.userModel.updateOne({ _id: user._id }, { active: true });

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

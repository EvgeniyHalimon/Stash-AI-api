import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto, SignInDto } from 'src/users/dto';
import { SignInPresenter, SignUpPresenter } from './dto';

import { hashPassword, verifyPassword } from './utils/passwordUtils';

import { ITokens } from './auth.types';
import { IUser } from 'src/users/user.types';

import { config } from '../config';

import { /* confirmationMail, sendMail, */ vocabulary } from 'src/shared';
import { UsersService } from 'src/users/user.service';

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
    readonly jwtService: JwtService,
    readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: CreateUserDto): Promise<SignUpPresenter> {
    try {
      const user = await this.userService.findOne(
        {
          email: signUpDto.email,
        },
        true,
      );

      if (user) {
        throw new BadRequestException(ALREADY_EXISTS);
      }

      const userAttributes = {
        ...signUpDto,
        password: await hashPassword(signUpDto.password),
      };

      /* const token = this.jwtService.sign(userWithoutPassword, {
      secret: config.SECRET_CONFIRM,
      expiresIn: config.EXPIRES_IN_CONFIRM,
    }); */

      // const message = confirmationMail(token, userWithoutPassword.firstName);

      //await sendMail([userWithoutPassword.email], 'Confirm your email', message);

      return await this.userService.create(userAttributes);
    } catch (error) {
      console.log('🚀 ~ AuthService ~ signUp ~ error:', error);
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInPresenter> {
    const { password, email } = signInDto;

    const { password: pwd, ...user } = await this.userService.findOne({
      email,
    });

    if (!user.active) {
      throw new BadRequestException(USER_IS_NOT_ACTIVE);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const match = await verifyPassword(password, pwd);
    if (!match) {
      throw new BadRequestException(WRONG_PASSWORD);
    }

    const { accessToken, refreshToken } = this.generateTokens(user);

    return new SignInPresenter(user, accessToken, refreshToken);
  }

  async refresh(_id: string): Promise<ITokens | void> {
    const user = await this.userService.findOne({
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

    const user = await this.userService.findOne({
      email,
    });

    if (!user) {
      throw new NotFoundException(NOT_FOUND);
    }

    if (user.active) {
      throw new BadRequestException(USER_ALREADY_ACTIVATED);
    }

    await this.userService.patch({
      updateUserDto: { active: true },
      userId: user._id,
    });

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

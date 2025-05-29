import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, SignInDto } from 'src/users/dto';
import { SignInPresenter, SignUpPresenter } from './dto';
import { hashPassword, verifyPassword } from './utils/passwordUtils';
import { ITokens } from './auth.types';
import { IUser } from 'src/users/user.types';
import { config } from '../config';
import { vocabulary } from 'src/shared';
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: CreateUserDto): Promise<SignUpPresenter> {
    try {
      const existingUser = await this.userService.findOne(
        { email: signUpDto.email },
        true,
      );

      if (existingUser) {
        throw new BadRequestException(ALREADY_EXISTS);
      }

      const userAttributes = {
        ...signUpDto,
        password: await hashPassword(signUpDto.password),
      };

      // mail stuff

      return await this.userService.create(userAttributes);
    } catch (error) {
      this.logger.error('Error during signUp', error.stack || error.message);
      if (error instanceof BadRequestException) throw error;
      throw new Error('Internal server error during sign up');
    }
  }

  async signIn(signInDto: SignInDto): Promise<SignInPresenter> {
    try {
      const { password, email } = signInDto;
      const userData = await this.userService.findOne({ email });

      if (!userData) throw new NotFoundException(NOT_FOUND);
      if (!userData.active) throw new BadRequestException(USER_IS_NOT_ACTIVE);

      const { password: hashedPassword, ...user } = userData;

      const match = await verifyPassword(password, hashedPassword);
      if (!match) throw new BadRequestException(WRONG_PASSWORD);

      const { accessToken, refreshToken } = this.generateTokens(user);

      return new SignInPresenter(user, accessToken, refreshToken);
    } catch (error) {
      this.logger.error('Error during signIn', error.stack || error.message);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Internal server error during sign in');
    }
  }

  async refresh(_id: string): Promise<ITokens> {
    try {
      const user = await this.userService.findOne({ _id });
      if (!user) throw new NotFoundException(NOT_FOUND);
      return this.generateTokens(user);
    } catch (error) {
      this.logger.error(
        'Error during token refresh',
        error.stack || error.message,
      );
      if (error instanceof NotFoundException) throw error;
      throw new Error('Internal server error during refresh');
    }
  }

  async confirmUser(token: string): Promise<{ message: string }> {
    try {
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

      const user = await this.userService.findOne({ email });

      if (!user) throw new NotFoundException(NOT_FOUND);
      if (user.active) throw new BadRequestException(USER_ALREADY_ACTIVATED);

      await this.userService.patch({
        userId: user._id,
        updateUserDto: { active: true },
      });

      return { message: USER_IS_ACTIVATED };
    } catch (error) {
      this.logger.error(
        'Error during confirmUser',
        error.stack || error.message,
      );
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new Error('Internal server error during user confirmation');
    }
  }

  generateTokens(user: Partial<IUser>): ITokens {
    try {
      const accessToken = this.jwtService.sign(user, {
        secret: config.SECRET_ACCESS,
        expiresIn: config.EXPIRES_IN,
      });

      const refreshToken = this.jwtService.sign(user, {
        secret: config.SECRET_REFRESH,
        expiresIn: config.EXPIRES_IN_REFRESH,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(
        'Token generation failed',
        error.stack || error.message,
      );
      throw new BadRequestException('Failed to generate tokens');
    }
  }
}

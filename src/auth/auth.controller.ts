import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  Param,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from 'src/shared/public.decorator';
import { SignInDto, CreateUserDto } from 'src/users/dto';
import { SignInPresenter, SignUpPresenter } from './dto';
import { ICustomRequest, vocabulary } from 'src/shared';
import { ITokens } from './auth.types';

const {
  auth: { WRONG_PASSWORD },
  users: { USER_NOT_FOUND: NOT_FOUND, ALREADY_EXISTS },
} = vocabulary;

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Log in an existing user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in.',
    type: SignInPresenter,
  })
  @ApiBadRequestResponse({
    example: {
      message: WRONG_PASSWORD,
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    description: 'When user provides an incorrect password.',
  })
  @ApiNotFoundResponse({
    example: {
      message: NOT_FOUND,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    description: "When user with provided email doesn't exist in the database.",
  })
  signIn(@Body() signInDTO: SignInDto): Promise<SignInPresenter> {
    return this.authService.signIn(signInDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully created an account.',
    type: SignUpPresenter,
  })
  @ApiBadRequestResponse({
    description: 'When user with the provided email already exists.',
    example: {
      message: ALREADY_EXISTS,
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    },
  })
  signUp(@Body() signUpDTO: CreateUserDto): Promise<SignUpPresenter> {
    return this.authService.signUp(signUpDTO);
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh authentication tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tokens successfully refreshed.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid refresh token or user not found.',
  })
  refresh(@Req() req: ICustomRequest): Promise<ITokens | void> {
    return this.authService.refresh(req.user._id);
  }

  @Get('confirm/:token')
  @Public()
  @ApiOperation({ summary: 'Confirm user account using email token' })
  @ApiParam({
    name: 'token',
    description: 'Confirmation token sent to user email.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully confirmed.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid or expired token.',
  })
  confirm(@Param('token') token: string) {
    return this.authService.confirmUser(token);
  }
}

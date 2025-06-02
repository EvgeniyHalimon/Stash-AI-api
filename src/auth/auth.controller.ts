import { Body, Controller, Post, Get, Req, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  SignInPresenter,
  SignUpPresenter,
  SignInDto,
  CreateUserDto,
} from './dto';
import { ICustomRequest } from 'src/shared';
import { ITokens } from './auth.types';
import {
  ConfirmDecorators,
  LoginDecorators,
  RefreshDecorators,
  RegisterDecorators,
} from './routeDecorators';

@ApiBearerAuth('bearer')
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post('login')
  @LoginDecorators()
  signIn(@Body() signInDTO: SignInDto): Promise<SignInPresenter> {
    return this.authService.signIn(signInDTO);
  }

  @Post('register')
  @RegisterDecorators()
  signUp(@Body() signUpDTO: CreateUserDto): Promise<SignUpPresenter> {
    return this.authService.signUp(signUpDTO);
  }

  @Get('refresh')
  @RefreshDecorators()
  refresh(@Req() req: ICustomRequest): Promise<ITokens | void> {
    return this.authService.refresh(req.user._id);
  }

  @Get('confirm/:token')
  @ConfirmDecorators()
  confirm(@Param('token') token: string) {
    return this.authService.confirmUser(token);
  }
}

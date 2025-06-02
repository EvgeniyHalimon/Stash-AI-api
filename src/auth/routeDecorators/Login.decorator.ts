import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SignInPresenter } from '../dto';
import { Public, vocabulary } from 'src/shared';

const {
  auth: { WRONG_PASSWORD },
  users: { USER_NOT_FOUND: NOT_FOUND },
} = vocabulary;

export function LoginDecorators() {
  return applyDecorators(
    Public(),
    ApiOperation({ summary: 'Log in an existing user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User successfully logged in.',
      type: SignInPresenter,
    }),
    ApiBadRequestResponse({
      example: {
        message: WRONG_PASSWORD,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      description: 'When user provides an incorrect password.',
    }),
    ApiNotFoundResponse({
      example: {
        message: NOT_FOUND,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      description:
        "When user with provided email doesn't exist in the database.",
    }),
  );
}

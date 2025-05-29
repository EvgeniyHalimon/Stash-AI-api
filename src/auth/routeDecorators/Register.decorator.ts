import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SignUpPresenter } from '../dto';
import { Public, vocabulary } from 'src/shared';

const {
  users: { ALREADY_EXISTS },
} = vocabulary;

export function RegisterDecorators() {
  return applyDecorators(
    Public(),
    ApiOperation({ summary: 'Register a new user' }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'User successfully created an account.',
      type: SignUpPresenter,
    }),
    ApiBadRequestResponse({
      description: 'When user with the provided email already exists.',
      example: {
        message: ALREADY_EXISTS,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
    }),
  );
}

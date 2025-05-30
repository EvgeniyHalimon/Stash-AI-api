import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { vocabulary } from 'src/shared';
import { UserPresenter } from '../dto';

const {
  users: { USER_NOT_FOUND, EMAIL_IS_TAKEN },
} = vocabulary;

export function PatchUserDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Update current user information' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully updated.',
      type: UserPresenter,
    }),
    ApiNotFoundResponse({
      example: {
        message: USER_NOT_FOUND,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
      description: 'When user does not exist in the database.',
    }),
    ApiBadRequestResponse({
      example: {
        message: EMAIL_IS_TAKEN,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      },
      description: 'When trying to update email to one that is already taken.',
    }),
  );
}

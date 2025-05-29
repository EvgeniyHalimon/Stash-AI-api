import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiParam,
} from '@nestjs/swagger';
import { Public } from 'src/shared';

export function ConfirmDecorators() {
  return applyDecorators(
    Public(),
    ApiOperation({ summary: 'Confirm user account using email token' }),
    ApiParam({
      name: 'token',
      description: 'Confirmation token sent to user email.',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully confirmed.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid or expired token.',
    }),
  );
}

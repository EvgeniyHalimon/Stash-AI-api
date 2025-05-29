import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function RefreshDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh authentication tokens' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Tokens successfully refreshed.',
    }),
    ApiBadRequestResponse({
      description: 'Invalid refresh token or user not found.',
    }),
  );
}

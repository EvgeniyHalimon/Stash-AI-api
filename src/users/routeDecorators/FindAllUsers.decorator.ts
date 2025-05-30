import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetAllUserPresenter } from '../dto';

export function FindAllUsersDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users with filtering and pagination' }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successfully retrieved list of users.',
      type: GetAllUserPresenter,
    }),
  );
}

import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function FindAllNotificationsDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all notifications' }),
    ApiResponse({
      status: 200,
      description: 'All notifications retrieved successfully.',
    }),
  );
}

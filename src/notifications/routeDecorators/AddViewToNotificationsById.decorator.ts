import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export function AddViewToNotificationsByIdDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Add view to notifications by IDs' }),
    ApiParam({
      name: 'notificationIds',
      description: 'Array of notification IDs (comma-separated)',
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'Views added to the specified notifications.',
    }),
  );
}

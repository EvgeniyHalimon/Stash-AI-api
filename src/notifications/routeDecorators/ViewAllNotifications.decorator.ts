import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ViewAllNotificationsDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Mark all notifications as viewed' }),
    ApiResponse({
      status: 200,
      description: 'All notifications marked as viewed.',
    }),
  );
}

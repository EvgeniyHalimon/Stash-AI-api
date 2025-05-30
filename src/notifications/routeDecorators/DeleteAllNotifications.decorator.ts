import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteAllNotificationsDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete all notifications for the user' }),
    ApiResponse({
      status: 200,
      description: 'All notifications deleted successfully.',
    }),
  );
}

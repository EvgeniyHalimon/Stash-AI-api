import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { vocabulary } from 'src/shared';

const {
  NOTIFICATIONS: { NOTIFICATION_NOT_FOUND },
} = vocabulary;

export function DeleteNotificationDecorators() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a notification by ID' }),
    ApiParam({ name: 'id', description: 'Notification ID' }),
    ApiResponse({
      status: 200,
      description: 'The notification has been successfully deleted.',
    }),
    ApiNotFoundResponse({
      description: 'Notification not found.',
      schema: {
        example: {
          message: NOTIFICATION_NOT_FOUND,
          error: 'Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        },
      },
    }),
  );
}

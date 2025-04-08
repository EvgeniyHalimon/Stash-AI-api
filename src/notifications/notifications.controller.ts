import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ICustomRequest, vocabulary } from 'src/shared';
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { GetAllNotificationDto } from './dto';

const {
  NOTIFICATIONS: { NOTIFICATION_NOT_FOUND },
} = vocabulary;

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({
    status: 200,
    description: 'All notifications retrieved successfully.',
  })
  @Get('/')
  findAll(@Query() query: GetAllNotificationDto) {
    return this.notificationsService.findAll(query);
  }

  @ApiOperation({ summary: 'Delete a notification by ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({
    status: 200,
    description: 'The notification has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Notification not found.',
    schema: {
      example: {
        message: NOTIFICATION_NOT_FOUND,
        error: 'Not Found',
        statusCode: HttpStatus.NOT_FOUND,
      },
    },
  })
  @Delete('/:id')
  delete(@Req() request: ICustomRequest, @Param('id') id: string) {
    return this.notificationsService.delete(id, request.user._id);
  }

  @ApiOperation({ summary: 'Mark all notifications as viewed' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as viewed.',
  })
  @Patch('/view-all')
  viewAll(@Req() request: ICustomRequest) {
    return this.notificationsService.viewAll(request.user._id);
  }

  @ApiOperation({ summary: 'Delete all notifications for the user' })
  @ApiResponse({
    status: 200,
    description: 'All notifications deleted successfully.',
  })
  @Delete('/delete-all')
  deleteAll(@Req() request: ICustomRequest) {
    return this.notificationsService.deleteAll(request.user._id);
  }

  @ApiOperation({ summary: 'Add view to notifications by IDs' })
  @ApiParam({
    name: 'notificationIds',
    description: 'Array of notification IDs (comma-separated)',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Views added to the specified notifications.',
  })
  @Patch('/add-view/:notificationIds')
  addViewToNotificationsByIds(
    @Req() request: ICustomRequest,
    @Param('notificationIds') notificationIds: string[],
  ) {
    return this.notificationsService.addViewToNotificationsByIds(
      request.user._id,
      notificationIds,
    );
  }
}

import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ICustomRequest } from 'src/shared';
import { ApiTags } from '@nestjs/swagger';
import { GetAllNotificationDto } from './dto';
import {
  AddViewToNotificationsByIdDecorators,
  DeleteAllNotificationsDecorators,
  DeleteNotificationDecorators,
  FindAllNotificationsDecorators,
  ViewAllNotificationsDecorators,
} from './routeDecorators';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @FindAllNotificationsDecorators()
  @Get()
  findAll(@Query() query: GetAllNotificationDto) {
    return this.notificationsService.findAll(query);
  }

  @DeleteNotificationDecorators()
  @Delete(':id')
  delete(@Req() request: ICustomRequest, @Param('id') id: string) {
    return this.notificationsService.delete(id, request.user._id);
  }

  @ViewAllNotificationsDecorators()
  @Patch('view-all')
  viewAll(@Req() request: ICustomRequest) {
    return this.notificationsService.viewAll(request.user._id);
  }

  @DeleteAllNotificationsDecorators()
  @Delete('delete-all')
  deleteAll(@Req() request: ICustomRequest) {
    return this.notificationsService.deleteAll(request.user._id);
  }

  @AddViewToNotificationsByIdDecorators()
  @Patch('add-view/:notificationIds')
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

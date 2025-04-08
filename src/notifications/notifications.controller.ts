import { Controller, Delete, Get, Param, Patch, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ICustomRequest } from 'src/shared';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/')
  findAll() {
    return this.notificationsService.findAll();
  }

  @Delete('/:id')
  delete(@Req() request: ICustomRequest, @Param('id') id: string) {
    return this.notificationsService.delete(id, request.user._id);
  }

  @Patch('/view-all')
  viewAll(@Req() request: ICustomRequest) {
    return this.notificationsService.viewAll(request.user._id);
  }

  @Delete('/delete-all')
  deleteAll(@Req() request: ICustomRequest) {
    return this.notificationsService.deleteAll(request.user._id);
  }

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

import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { notificationsProviders } from './goods.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [NotificationsService, ...notificationsProviders],
  controllers: [NotificationsController],
  imports: [DatabaseModule],
})
export class NotificationsModule {}

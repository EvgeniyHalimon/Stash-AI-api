import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationsSchema } from './notifications.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [NotificationsService],
  controllers: [NotificationsController],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationsSchema },
    ]),
  ],
})
export class NotificationsModule {}

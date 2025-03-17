import { Inject, Injectable } from '@nestjs/common';
import { Model, QueryOptions } from 'mongoose';

import { modelsVocabulary } from 'src/shared';
import { INotifications } from './notifications.types';
import { CreateNotificationDto } from './dto';

const { NOTIFICATION_MODEL } = modelsVocabulary;

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_MODEL)
    private readonly notificationModel: Model<INotifications>,
  ) {}

  async findAll() {
    const notifications = await this.notificationModel.find();

    return notifications;
  }

  async create(params) {
    return this.notificationModel.create(params);
  }

  async purge(_id: string, user: string) {
    return await this.notificationModel.deleteOne({ _id, user });
  }

  async viewAll(user: string) {
    return await this.notificationModel.updateMany(
      { isViewed: false, user },
      { isViewed: true },
    );
  }

  async deleteAll(user: string) {
    return await this.notificationModel.deleteMany({ user });
  }

  addViewToNotificationsByIds = async (
    user: string,
    notificationIds: string[],
  ) => {
    const params = {
      _id: { $in: notificationIds },
      user,
    };

    const data = {
      $set: { isViewed: true },
    };

    const result = await this.notificationModel.updateMany(params, data);

    return result;
  };

  findOne(
    params: QueryOptions<Partial<CreateNotificationDto>>,
  ): Promise<INotifications | null> {
    return this.notificationModel.findOne(params);
  }
}

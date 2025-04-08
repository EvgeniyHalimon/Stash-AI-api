import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, QueryOptions } from 'mongoose';
import { INotifications } from './notifications.types';
import {
  CreateNotificationDto,
  GetAllNotificationDto,
  GetAllNotificationsPresenter,
} from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notifications.schema';
import { vocabulary } from 'src/shared';

const {
  NOTIFICATIONS: { NOTIFICATION_NOT_FOUND },
} = vocabulary;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<INotifications>,
  ) {}

  async findAll(queryParams: GetAllNotificationDto) {
    const { sort, sortBy, page = 1, limit = 10 } = queryParams;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sort === 'asc' ? 1 : -1;
    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments().exec(),
    ]);

    return new GetAllNotificationsPresenter(notifications, total, page, limit);
  }

  async create(params) {
    return this.notificationModel.create(params);
  }

  async delete(_id: string, user: string) {
    await this.findOne({ _id });
    return await this.notificationModel.deleteOne({ _id, user });
  }

  async viewAll(user: string) {
    return await this.notificationModel.updateMany(
      { isViewed: false, user },
      { isViewed: true },
    );
  }

  async addView(id: string, user: string) {
    return await this.notificationModel.updateOne(
      { _id: id, isViewed: false, user },
      { isViewed: true },
    );
  }

  async deleteAll(user: string) {
    return await this.notificationModel.deleteMany({ user });
  }

  async addViewToNotificationsByIds(user: string, notificationIds: string[]) {
    const params = {
      _id: { $in: notificationIds },
      user,
    };

    const data = {
      $set: { isViewed: true },
    };

    const result = await this.notificationModel.updateMany(params, data);

    return result;
  }

  async findOne(
    params: QueryOptions<Partial<CreateNotificationDto>>,
  ): Promise<INotifications | null> {
    const notification = await this.notificationModel.findOne(params);
    if (!notification) {
      throw new NotFoundException(NOTIFICATION_NOT_FOUND);
    }
    return notification;
  }
}

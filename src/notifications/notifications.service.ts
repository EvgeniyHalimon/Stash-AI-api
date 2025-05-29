import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<INotifications>,
  ) {}

  async findAll(queryParams: GetAllNotificationDto) {
    try {
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

      return new GetAllNotificationsPresenter(
        notifications,
        total,
        page,
        limit,
      );
    } catch (error) {
      this.logger.error('Error during findAll', error.stack || error.message);
      throw new InternalServerErrorException(
        'Failed to retrieve notifications',
      );
    }
  }

  async create(params: CreateNotificationDto) {
    try {
      return await this.notificationModel.create(params);
    } catch (error) {
      this.logger.error('Error during create', error.stack || error.message);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async delete(_id: string, user: string) {
    try {
      await this.findOne({ _id });
      return await this.notificationModel.deleteOne({ _id, user });
    } catch (error) {
      this.logger.error('Error during delete', error.stack || error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete notification');
    }
  }

  async viewAll(user: string) {
    try {
      return await this.notificationModel.updateMany(
        { isViewed: false, user },
        { isViewed: true },
      );
    } catch (error) {
      this.logger.error('Error during viewAll', error.stack || error.message);
      throw new InternalServerErrorException(
        'Failed to mark notifications as viewed',
      );
    }
  }

  async addView(id: string, user: string) {
    try {
      return await this.notificationModel.updateOne(
        { _id: id, isViewed: false, user },
        { isViewed: true },
      );
    } catch (error) {
      this.logger.error('Error during addView', error.stack || error.message);
      throw new InternalServerErrorException(
        'Failed to mark notification as viewed',
      );
    }
  }

  async deleteAll(user: string) {
    try {
      return await this.notificationModel.deleteMany({ user });
    } catch (error) {
      this.logger.error('Error during deleteAll', error.stack || error.message);
      throw new InternalServerErrorException(
        'Failed to delete all notifications',
      );
    }
  }

  async addViewToNotificationsByIds(user: string, notificationIds: string[]) {
    try {
      const params = {
        _id: { $in: notificationIds },
        user,
      };

      const data = {
        $set: { isViewed: true },
      };

      return await this.notificationModel.updateMany(params, data);
    } catch (error) {
      this.logger.error(
        'Error during addViewToNotificationsByIds',
        error.stack || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to mark selected notifications as viewed',
      );
    }
  }

  async findOne(
    params: QueryOptions<Partial<CreateNotificationDto>>,
  ): Promise<INotifications | null> {
    try {
      const notification = await this.notificationModel.findOne(params);
      if (!notification) {
        throw new NotFoundException(NOTIFICATION_NOT_FOUND);
      }
      return notification;
    } catch (error) {
      this.logger.error('Error during findOne', error.stack || error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to retrieve notification');
    }
  }
}

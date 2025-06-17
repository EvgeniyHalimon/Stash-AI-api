import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostponementHistory } from './postponement-history.schema';
import { Model } from 'mongoose';
import { IPostponementHistory } from './postponement-history.types';
import { FindAllHistoryDto, GetAllHistoryPresenter } from './dto';

@Injectable()
export class PostponementHistoryService {
  private readonly logger = new Logger(PostponementHistory.name);

  constructor(
    @InjectModel(PostponementHistory.name)
    private readonly postponementHistory: Model<IPostponementHistory>,
  ) {}

  async create(historyData: Partial<IPostponementHistory>) {
    try {
      const history = new this.postponementHistory(historyData);
      return await history.save();
    } catch (error) {
      this.logger.error(
        'Error creating postponement history',
        error.stack || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to create postponement history',
      );
    }
  }

  async findAll(queryParams: FindAllHistoryDto, user?: string) {
    const { date, range } = queryParams;

    const filter: Record<string, any> = user ? { user } : {};

    if (date) {
      const targetDate = new Date(`${date}T00:00:00.000Z`);

      let from: Date;
      let to: Date;

      if (range === 'day') {
        from = new Date(targetDate);
        to = new Date(targetDate);
        to.setUTCHours(23, 59, 59, 999);
      } else {
        const year = targetDate.getUTCFullYear();
        const month = targetDate.getUTCMonth();
        from = new Date(Date.UTC(year, month, 1));
        to = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
      }

      filter.createdAt = {
        $gte: from,
        $lte: to,
      };
    } else {
      // year range
      const year = new Date().getUTCFullYear();
      const from = new Date(Date.UTC(year, 0, 1));
      const to = new Date(Date.UTC(year + 1, 0, 0, 23, 59, 59, 999));

      filter.createdAt = {
        $gte: from,
        $lte: to,
      };
    }

    const query = await this.postponementHistory
      .find(filter)
      .sort({ createdAt: -1 });

    return new GetAllHistoryPresenter(query);
  }

  async deleteManyGoods(_id: string) {
    try {
      return this.postponementHistory.deleteMany({ _id });
    } catch (error) {
      this.logger.error(
        'Error deleting postponement history',
        error.stack || error.message,
      );
      throw new InternalServerErrorException(
        'Failed to delete postponement history',
      );
    }
  }
}

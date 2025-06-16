import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostponementHistory } from './postponement-history.schema';
import { Model } from 'mongoose';
import { IPostponementHistory } from './postponement-history.types';

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
}

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoodsService } from 'src/goods/goods.service';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    readonly userService: UsersService,
    readonly goodsService: GoodsService,
  ) {}
  @Cron('45 * * * * *')
  handleCron() {
    console.log('Cron job executed every 45 seconds');
  }
}

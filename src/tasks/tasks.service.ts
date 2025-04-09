import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventsGateway } from 'src/events/events.gateway';
import { GoodsService } from 'src/goods/goods.service';
import { UsersService } from 'src/users/user.service';

@Injectable()
export class TasksService {
  constructor(
    readonly userService: UsersService,
    readonly goodsService: GoodsService,
    readonly eventsGateway: EventsGateway,
  ) {}

  @Cron('10 * * * *')
  async everyDayAt9AM() {
    const goods = await this.goodsService.findEndingSoonForEachUser(1440);

    console.log(goods);
  }

  @Cron('0 12 * * 1')
  async everyWeekAtMonday() {
    const goods = await this.goodsService.findEndingSoonForEachUser(10080);

    console.log(goods);
  }
}

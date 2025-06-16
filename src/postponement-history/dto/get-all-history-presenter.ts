import { ApiProperty } from '@nestjs/swagger';
import { HistoryPresenter } from './history-presenter';
import { IPostponementHistory } from '../postponement-history.types';

export class GetAllHistoryPresenter {
  @ApiProperty({
    type: [HistoryPresenter],
    description: 'Represents array of users.',
  })
  goods: HistoryPresenter[];

  constructor(history: IPostponementHistory[]) {
    this.goods = history.map((good) => new HistoryPresenter(good));
  }
}

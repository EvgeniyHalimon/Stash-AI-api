import { ApiProperty } from '@nestjs/swagger';
import { UserPresenter } from './user-presenter';
import { IUser } from '../user.types';

export class GetAllUserPresenter {
  @ApiProperty({
    type: [UserPresenter],
    description: 'Represents array of users.',
  })
  users: UserPresenter[];

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Represents count of users',
  })
  count: number;

  constructor(users: IUser[], count: number) {
    this.users = users.map((user) => new UserPresenter(user));
    this.count = count;
  }
}

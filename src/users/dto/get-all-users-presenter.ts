// library
import { ApiProperty } from '@nestjs/swagger';

// dto
import { UserPresenter } from './user-presenter';
import User from '../user.schema';

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

  constructor(users: User[], count: number) {
    this.users = users.map(user => new UserPresenter(user));
    this.count = count;
  }
}

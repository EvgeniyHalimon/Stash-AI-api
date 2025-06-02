import { ApiProperty } from '@nestjs/swagger';

import { IUser, UserRole } from '../user.types';

export class UserPresenter {
  @ApiProperty({
    example: 'd0601328-1486-434a-860e-75b843a682db',
    type: String,
    description: 'Represents id of the user',
  })
  _id: string;

  @ApiProperty({
    example: 'John',
    type: String,
    description: 'Represents first name of the user',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    type: String,
    description: 'Represents last name of the user',
  })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    type: String,
    description: 'Represents email of the user',
  })
  email: string;

  @ApiProperty({
    example: 'user',
    type: String,
    description: 'Represents the role of the user',
  })
  role: UserRole;

  @ApiProperty({
    example: true,
    type: Boolean,
    nullable: true,
    description: 'Represents whether the user is activated or not',
  })
  active: boolean;

  @ApiProperty({
    example: '2024-08-14T08:40:32.000Z',
    type: String,
    description: 'Represents the creation date of the user',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-08-14T08:40:32.000Z',
    type: String,
    description: 'Represents the last update date of the user',
  })
  updatedAt: Date;

  constructor(user: IUser) {
    this._id = user._id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.active = user.active;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

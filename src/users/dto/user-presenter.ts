// library
import { ApiProperty } from '@nestjs/swagger';

// schema
import User from '../user.schema';
import { UserRole } from '../user.types';

export class UserPresenter {
  @ApiProperty({
    example: 'd0601328-1486-434a-860e-75b843a682db',
    type: String,
    description: 'Represents id of the author',
  })
  id: string;

  @ApiProperty({
    example: 'John',
    type: String,
    description: 'Represents first name of the author',
  })
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    type: String,
    description: 'Represents last name of the author',
  })
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    type: String,
    description: 'Represents email of the author',
  })
  email: string;

  @ApiProperty({
    example: 'A brief bio of the author',
    type: String,
    description: 'Represents bio of the author',
  })
  bio: string;

  @ApiProperty({
    example: 'user',
    type: String,
    description: 'Represents the role of the author',
  })
  role: UserRole;

  @ApiProperty({
    example: null,
    type: String,
    nullable: true,
    description: 'Represents the photo of the author',
  })
  photo: string | null;

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
    description: 'Represents the creation date of the author',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-08-14T08:40:32.000Z',
    type: String,
    description: 'Represents the last update date of the author',
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.bio = user.bio;
    this.role = user.role;
    this.photo = user.photo;
    this.active = user.active;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

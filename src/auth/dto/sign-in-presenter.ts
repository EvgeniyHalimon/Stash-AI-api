import { ApiProperty } from '@nestjs/swagger';
import { IUser } from 'src/users/user.types';

export class SignInPresenter {
  @ApiProperty({
    example: {
      id: 'd0601328-1486-434a-860e-75b843a682db',
      firstName: 'string',
      lastName: 'string',
      email: 'q@email.com',
      role: 'user',
      active: true,
      createdAt: '2024-08-14T08:40:32.000Z',
      updatedAt: '2024-08-23T11:50:47.000Z',
    },
  })
  user: Partial<IUser>;

  @ApiProperty({ example: 'accessToken' })
  accessToken: string;

  @ApiProperty({ example: 'refreshToken' })
  refreshToken: string;

  constructor(
    user: Partial<IUser>,
    accessTokens: string,
    refreshToken: string,
  ) {
    this.user = user;
    this.accessToken = accessTokens;
    this.refreshToken = refreshToken;
  }
}

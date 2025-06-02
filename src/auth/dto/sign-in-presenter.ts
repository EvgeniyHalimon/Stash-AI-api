import { ApiProperty } from '@nestjs/swagger';
import { userExample } from 'src/users/user.constants';
import { IUser } from 'src/users/user.types';

export class SignInPresenter {
  @ApiProperty({
    example: userExample,
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

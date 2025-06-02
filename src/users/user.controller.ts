import { Body, Controller, Get, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UsersService } from './user.service';
import {
  GetAllUserPresenter,
  GetAllUsersDto,
  PatchUserDto,
  UserPresenter,
} from './dto';

import { CurrentUser } from 'src/shared';
import { FindAllUsersDecorators, PatchUserDecorators } from './routeDecorators';
import { IUser } from './user.types';

@ApiBearerAuth('bearer')
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @FindAllUsersDecorators()
  findAll(@Query() query: GetAllUsersDto): Promise<GetAllUserPresenter> {
    return this.usersService.findAll(query);
  }

  @Patch()
  @PatchUserDecorators()
  patch(
    @Body() updateUserDto: PatchUserDto,
    @CurrentUser() { _id }: IUser,
  ): Promise<UserPresenter> {
    return this.usersService.patch(updateUserDto, _id);
  }
}

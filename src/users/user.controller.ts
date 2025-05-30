import { Body, Controller, Get, Patch, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './user.service';
import {
  GetAllUserPresenter,
  GetAllUsersDto,
  PatchUserDto,
  UserPresenter,
} from './dto';

import { ICustomRequest } from 'src/shared';
import { FindAllUsersDecorators, PatchUserDecorators } from './routeDecorators';

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
    @Req() req: ICustomRequest,
  ): Promise<UserPresenter> {
    return this.usersService.patch({
      updateUserDto,
      userId: req.user._id,
    });
  }
}

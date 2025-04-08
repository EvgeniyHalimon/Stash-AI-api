import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './user.service';
import {
  GetAllUserPresenter,
  GetAllUsersDto,
  PatchUserDto,
  UserPresenter,
} from './dto';

import { ICustomRequest, vocabulary } from 'src/shared';

const {
  users: { USER_NOT_FOUND, EMAIL_IS_TAKEN },
} = vocabulary;

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all users with filtering and pagination' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved list of users.',
    type: GetAllUserPresenter,
  })
  findAll(@Query() query: GetAllUsersDto): Promise<GetAllUserPresenter> {
    return this.usersService.findAll(query);
  }

  @Patch('/')
  @ApiOperation({ summary: 'Update current user information' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully updated.',
    type: UserPresenter,
  })
  @ApiNotFoundResponse({
    example: {
      message: USER_NOT_FOUND,
      error: 'Not Found',
      statusCode: HttpStatus.NOT_FOUND,
    },
    description: 'When user does not exist in the database.',
  })
  @ApiBadRequestResponse({
    example: {
      message: EMAIL_IS_TAKEN,
      error: 'Bad Request',
      statusCode: HttpStatus.BAD_REQUEST,
    },
    description: 'When trying to update email to one that is already taken.',
  })
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

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, QueryOptions } from 'mongoose';

import {
  CreateUserDto,
  GetAllUserPresenter,
  GetAllUsersDto,
  PatchUserDto,
  UserPresenter,
} from './dto';

import { hashPassword } from 'src/auth/utils/passwordUtils';

import { IUser } from './user.types';

import { vocabulary } from 'src/shared';
import { SignUpPresenter } from 'src/auth/dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

const {
  users: { USER_NOT_FOUND, EMAIL_IS_TAKEN },
} = vocabulary;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async findAll(queryParams: GetAllUsersDto): Promise<GetAllUserPresenter> {
    const { sort, sortBy, page = 1, limit = 10 } = queryParams;
    const skip = (page - 1) * limit;

    const sortOptions = {};
    sortOptions[sortBy] = sort === 'asc' ? 1 : -1;
    const [users, total] = await Promise.all([
      this.userModel.find().sort(sortOptions).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    return new GetAllUserPresenter(users, total, page, limit);
  }

  async patch({
    updateUserDto,
    userId,
  }: {
    updateUserDto: Partial<PatchUserDto>;
    userId: string;
  }): Promise<UserPresenter> {
    const user = await this.findOne({ _id: userId });

    if (updateUserDto.email) {
      const searchedUser = await this.findOne({ email: updateUserDto.email });
      if (searchedUser) {
        throw new BadRequestException(EMAIL_IS_TAKEN);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    const updateObject = {
      ...updateUserDto,
    };

    user.set(updateObject);

    const updatedUser = await user.save();

    return new UserPresenter(updatedUser);
  }

  async findOne(
    params: QueryOptions<Partial<IUser>>,
    forSignUp = false,
  ): Promise<IUser | null> {
    const user = await this.userModel.findOne(params);
    if (!user && !forSignUp) {
      throw new NotFoundException(USER_NOT_FOUND);
    }

    return user;
  }

  async create(userAttributes: Partial<CreateUserDto>) {
    const createdUser = await this.userModel.create(userAttributes);

    return new SignUpPresenter(createdUser.toObject());
  }
}

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Model, QueryOptions } from 'mongoose';

import {
  GetAllUserPresenter,
  GetAllUsersDto,
  PatchUserDto,
  UserPresenter,
} from './dto';

import { hashPassword } from 'src/auth/utils/passwordUtils';

import { IUser } from './user.types';

import { vocabulary } from 'src/shared';
import { CreateUserDto, SignUpPresenter } from 'src/auth/dto';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';

const {
  users: { USER_NOT_FOUND, EMAIL_IS_TAKEN },
} = vocabulary;

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
  ) {}

  async findAll(queryParams: GetAllUsersDto): Promise<GetAllUserPresenter> {
    try {
      const { sort, sortBy, page = 1, limit = 10 } = queryParams;
      const skip = (page - 1) * limit;

      const sortOptions = {};
      sortOptions[sortBy] = sort === 'asc' ? 1 : -1;

      const [users, total] = await Promise.all([
        this.userModel.find().sort(sortOptions).skip(skip).limit(limit).exec(),
        this.userModel.countDocuments().exec(),
      ]);

      return new GetAllUserPresenter(users, total, page, limit);
    } catch (error) {
      this.logger.error('Error during findAll', error.stack || error.message);
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async patch({
    updateUserDto,
    userId,
  }: {
    updateUserDto: Partial<PatchUserDto>;
    userId: string;
  }): Promise<UserPresenter> {
    try {
      const user = await this.findOne({ _id: userId });

      if (updateUserDto.email) {
        const searchedUser = await this.findOne(
          { email: updateUserDto.email },
          true,
        );
        if (searchedUser && searchedUser._id.toString() !== userId) {
          throw new BadRequestException(EMAIL_IS_TAKEN);
        }
      }

      if (updateUserDto.password) {
        updateUserDto.password = await hashPassword(updateUserDto.password);
      }

      user.set({ ...updateUserDto });
      const updatedUser = await user.save();

      return new UserPresenter(updatedUser);
    } catch (error) {
      this.logger.error('Error during patch', error.stack || error.message);
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async findOne(
    params: QueryOptions<Partial<IUser>>,
    forSignUp = false,
  ): Promise<IUser | null> {
    try {
      const user = await this.userModel.findOne(params);
      if (!user && !forSignUp) {
        throw new NotFoundException(USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      this.logger.error('Error during findOne', error.stack || error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to find user');
    }
  }

  async create(userAttributes: Partial<CreateUserDto>) {
    try {
      const createdUser = await this.userModel.create(userAttributes);
      return new SignUpPresenter(createdUser.toObject());
    } catch (error) {
      this.logger.error('Error during create', error.stack || error.message);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}

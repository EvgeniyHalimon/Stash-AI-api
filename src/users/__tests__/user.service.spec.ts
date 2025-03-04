import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import User from '../user.schema';
import { UsersService } from '../user.service';

import * as passwordUtils from 'src/auth/utils/passwordUtils';

jest.mock('src/auth/utils/passwordUtils');

describe('UsersService', () => {
  let userService: UsersService;
  let mockUserModel: {
    findOne: jest.Mock;
    findAndCountAll: jest.Mock;
    save: jest.Mock;
    set: jest.Mock;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findAndCountAll: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    mockUserModel = module.get(getModelToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('UsersService findAll method', () => {
    it('should return users and count', async () => {
      const result = {
        rows: [
          {
            id: 'string',
            firstName: 'string',
            lastName: 'string',
            email: 'string',
            bio: 'string',
            role: 'user',
            createdAt: new Date('2024-08-14T08:40:32.000Z'),
            updatedAt: new Date('2024-08-14T08:40:32.000Z'),
            photo: 'string',
          },
        ],
        count: 1,
      };

      jest
        .spyOn(mockUserModel, 'findAndCountAll')
        .mockResolvedValue(result as any);

      const users = await userService.findAll();
      expect(mockUserModel.findAndCountAll).toHaveBeenCalledTimes(1);
      expect(users).toEqual({
        users: result.rows,
        count: result.count,
      });
    });
  });

  describe('UsersService patch method', () => {
    const updatedUser = {
      id: '1',
      firstName: 'string',
      lastName: 'string',
      email: 'string',
      password: 'plain-text-password',
      bio: 'string',
      role: 'user',
      createdAt: new Date('2024-08-14T08:40:32.000Z'),
      updatedAt: new Date('2024-08-14T08:40:32.000Z'),
      photo: 'string',
      articles: [],
      comments: [],
      reactions: [],
    };

    it('should successfully patch a user', async () => {
      const mockUser = {
        set: jest.fn(),
        save: jest.fn().mockReturnValue(updatedUser),
      };

      mockUserModel.findOne.mockResolvedValueOnce(mockUser);
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue(
        'hashed-password',
      );

      const updateUserDto = {
        email: 'new@example.com',
        password: 'plain-text-password',
      };

      const result = await userService.patch({
        updateUserDto,
        file: undefined,
        userId: '1',
      });

      expect(mockUserModel.findOne).toHaveBeenCalledTimes(2);
      expect(mockUser.set).toHaveBeenCalledWith({
        ...updateUserDto,
        password: 'hashed-password',
        photo: undefined,
      });
      expect(mockUser.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      try {
        await userService.patch({
          updateUserDto: {
            email: 'taken@example.com',
          },
          file: undefined,
          userId: '1',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });

    it('should throw BadRequestException if email is taken', async () => {
      const mockUser = {
        set: jest.fn(),
        save: jest.fn(),
      };
      mockUserModel.findOne.mockResolvedValueOnce({ id: '2' });
      mockUserModel.findOne.mockResolvedValueOnce(mockUser);

      try {
        await userService.patch({
          updateUserDto: {
            email: 'taken@example.com',
          },
          file: undefined,
          userId: '1',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('This email is taken');
      }
    });

    it('check work of if statements', async () => {
      const mockUser = {
        set: mockUserModel.set,
        save: mockUserModel.save.mockResolvedValue(updatedUser),
      };
      mockUserModel.findOne.mockResolvedValue({
        updatedUser,
        ...mockUser,
      });
      const mockHashPassword = (
        passwordUtils.hashPassword as jest.Mock
      ).mockResolvedValue('hashed-password');

      await userService.patch({
        updateUserDto: { firstName: 'John' },
        file: undefined,
        userId: '1',
      });

      expect(mockUserModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockHashPassword).toHaveBeenCalledTimes(0);
      expect(mockUser.set).toHaveBeenCalledWith({
        firstName: 'John',
      });
    });
  });

  describe('UsersService findOne method', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await userService.findOne({ id: '1' });

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userService.findOne({ id: '2' });

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        where: { id: '2' },
      });
      expect(result).toBeNull();
    });
  });
});

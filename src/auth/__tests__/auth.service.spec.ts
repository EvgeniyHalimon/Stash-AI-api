import { Test } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getModelToken } from '@nestjs/sequelize';
import User from 'src/users/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as passwordUtils from 'src/auth/utils/passwordUtils';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { vocabulary } from 'src/shared';
import { config } from 'src/config';
import { IUser } from 'src/users/user.types';

const {
  auth: { WRONG_PASSWORD },
  users: { USER_NOT_FOUND: NOT_FOUND, ALREADY_EXISTS },
} = vocabulary;

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserModel: {
    findOne: jest.Mock;
    create: jest.Mock;
    scope: jest.Mock;
  };

  let mockJwtService: {
    sign: jest.Mock;
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            scope: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    mockUserModel = module.get(getModelToken(User));
    mockJwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  const user = {
    id: 'string',
    firstName: 'string',
    lastName: 'string',
    email: 'string',
    bio: 'string',
    role: 'user',
    createdAt: new Date('2024-08-14T08:40:32.000Z'),
    updatedAt: new Date('2024-08-14T08:40:32.000Z'),
    photo: null,
  };

  const signInUser = {
    dataValues: user,
  };

  const signInDto = {
    email: 'w@email.com',
    password: '1234',
  };

  const signUpDto = {
    firstName: 'string',
    lastName: 'string',
    email: 'tt@email.com',
    password: 'hashed-password',
    bio: 'string',
  };

  describe('SignIn method', () => {
    it('should have successful login', async () => {
      const mockFindOne = jest.fn().mockResolvedValue(signInUser);
      mockUserModel.scope.mockReturnValue({
        findOne: mockFindOne,
      });

      jest.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(true);

      jest.spyOn(authService, 'generateTokens').mockReturnValue({
        accessToken: 'token',
        refreshToken: 'token',
      });

      const result = await authService.signIn(signInDto);

      expect(mockUserModel.scope).toHaveBeenCalledWith('withPassword');
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
      expect(result?.user).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });
      try {
        await authService.signIn(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(NOT_FOUND);
      }
    });

    it('should throw BadRequestException if password mismatch', async () => {
      mockUserModel.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(signInUser),
      });
      jest.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(false);
      try {
        await authService.signIn(signUpDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(WRONG_PASSWORD);
      }
    });
  });

  describe('SignUp method', () => {
    it('create new user', async () => {
      mockUserModel.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });
      mockUserModel.create.mockResolvedValue({ ...user, password: '1234' });
      jest
        .spyOn(passwordUtils, 'hashPassword')
        .mockResolvedValue('hashed-password');
      const result = await authService.signUp(signUpDto);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        ...signUpDto,
        password: 'hashed-password',
      });
      expect(result).toEqual(user);
    });

    it('should throw BadRequestException if user exist', async () => {
      mockUserModel.scope.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(user),
      });
      try {
        await authService.signUp(signUpDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(ALREADY_EXISTS);
      }
    });
  });

  describe('GenerateTokens method', () => {
    it('should generate access token and refresh token with correct payload and options', () => {
      const mockUser: Partial<IUser> = {
        id: '1',
        email: 'test@example.com',
      };

      const mockAccessToken = 'mockAccessToken';
      const mockRefreshToken = 'mockRefreshToken';

      mockJwtService.sign
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);

      const tokens = authService.generateTokens(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith(mockUser, {
        secret: config.SECRET_ACCESS,
        expiresIn: config.EXPIRES_IN,
      });

      expect(mockJwtService.sign).toHaveBeenCalledWith(mockUser, {
        secret: config.SECRET_REFRESH,
        expiresIn: config.EXPIRES_IN_REFRESH,
      });

      expect(tokens).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });
});

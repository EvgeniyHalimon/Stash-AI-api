import { Test } from '@nestjs/testing';
import { UsersController } from '../user.controller';
import { UsersService } from '../user.service';
import { GetAllUserPresenter, PatchUserDto } from '../dto';
import { ICustomRequest } from 'src/shared';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    patch: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('FindAll method', () => {
    it('method findAll must be called and should returned instance of response dto', async () => {
      const mockResult = new GetAllUserPresenter([], 1);

      jest.spyOn(mockUsersService, 'findAll').mockResolvedValue(mockResult);

      const result = await usersController.findAll();
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(GetAllUserPresenter);
    });
  });

  describe('Patch method', () => {
    const updateUserDto = {} as PatchUserDto;
    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      size: 1024,
      stream: {} as any,
      destination: '',
      filename: 'test.png',
      path: '',
      buffer: Buffer.from(''),
    };
    const req = {
      user: {
        id: 'string',
      },
    } as ICustomRequest;

    it('method patch should returned instance of response dto', async () => {
      const mockResult = new PatchUserDto();

      jest.spyOn(mockUsersService, 'patch').mockResolvedValue(mockResult);

      const result = await usersController.patch(updateUserDto, file, req);
      expect(result).toBeInstanceOf(PatchUserDto);
    });

    it('method patch must be called the service with the correct parameters', async () => {
      const updateUserDto = { email: 'newemail@example.com' } as PatchUserDto;
      const file = {
        mimetype: 'image/png',
        buffer: Buffer.from('image data'),
      } as Express.Multer.File;
      const req = { user: { id: '123' } } as ICustomRequest;

      await usersController.patch(updateUserDto, file, req);

      const base64 = file?.buffer?.toString('base64');

      expect(mockUsersService.patch).toHaveBeenCalledWith({
        updateUserDto,
        file: `data:${file.mimetype};base64,${base64}`,
        userId: req.user.id,
      });
    });
  });
});

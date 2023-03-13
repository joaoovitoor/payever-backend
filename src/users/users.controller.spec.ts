import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RabbitMQService } from '../shared/rabbitmq.service';
import { UserDto } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
            getUserAvatar: jest.fn(),
            deleteUserAvatar: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  describe('getUser', () => {
    it('should return a user', async () => {
      const user = { id: 1, name: 'John Doe' };
      jest.spyOn(userService, 'getUser').mockResolvedValue(user);

      expect(await controller.getUser('1')).toBe(user);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user = { name: 'John Doe' } as UserDto;
      const createdUser = { id: 1, name: 'John Doe' };
      jest.spyOn(userService, 'createUser').mockResolvedValue(createdUser);
      jest.spyOn(rabbitMQService, 'sendMessage').mockResolvedValue(null);

      expect(await controller.createUser(user)).toBe(createdUser);
      expect(rabbitMQService.sendMessage).toHaveBeenCalledWith(
        'email-queue',
        `Novo usuário criado: ${createdUser.name}`,
      );
    });
  });

  describe('getUserAvatar', () => {
    it('should return the user avatar', async () => {
      const avatar = { data: 'base64-encoded-image-data' };
      jest.spyOn(userService, 'getUserAvatar').mockResolvedValue(avatar.data);

      const response = await controller.getUserAvatar('1');

      expect(response).toEqual(avatar.data);
    });
  });

  describe('deleteUserAvatar', () => {
    it('should delete a user avatar', async () => {
      jest.spyOn(userService, 'deleteUserAvatar').mockResolvedValue(null);

      expect(await controller.deleteUserAvatar('1')).toBeNull();
    });
  });
});

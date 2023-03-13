import { Controller, Get, Param, Post, Delete, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { RabbitMQService } from '../shared/rabbitmq.service';
import { UserDto } from './dto/user.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rabbitMQService: RabbitMQService, // Injeção de dependência do serviço RabbitMQ
  ) {}

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

  @Post()
  async createUser(@Body() User: UserDto) {
    const createdUser = await this.usersService.createUser(User);
    await this.rabbitMQService.sendMessage(
      'email-queue',
      `Novo usuário criado: ${createdUser.name}`,
    );
    return createdUser;
  }

  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    return this.usersService.getUserAvatar(userId);
  }

  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    return this.usersService.deleteUserAvatar(userId);
  }
}

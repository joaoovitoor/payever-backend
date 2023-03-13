import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RabbitMQService } from '../shared/rabbitmq.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RabbitMQService],
})
export class UsersModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMQService } from './shared/rabbitmq.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Instancia a classe RabbitMQService e se conecta ao servidor RabbitMQ
  const rabbitMQService = app.get(RabbitMQService);
  await rabbitMQService.createConnection();

  await app.listen(3000);
}
bootstrap();

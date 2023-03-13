import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly uri = 'amqp://localhost:5672';

  async createConnection(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.uri);
      this.channel = await this.connection.createChannel();
    } catch (err) {
      console.error(`Error connecting to RabbitMQ: ${err.message}`);
    }
  }

  async closeConnection(): Promise<void> {
    await this.channel.close();
    await this.connection.close();
  }

  async sendMessage(queue: string, message: string): Promise<void> {
    if (this.connection && this.connection.isOpen()) {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true,
      });
    } else {
      console.error('The RabbitMQ connection is not connected');
    }
  }
}

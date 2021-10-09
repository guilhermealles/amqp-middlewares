import amqplib from 'amqplib';
import { AmqpClient } from './AmqpClient';

export class AmqpClientFactory {
  static async GetClientInstance(config: AmqpConfig): Promise<AmqpClient> {
    const { username, password, host, port, vhost } = config;
    const amqpUrl = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

    const amqpChannel = await (await amqplib.connect(amqpUrl)).createChannel();
    return new AmqpClient(amqpChannel);
  }
}

interface AmqpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  vhost: string;
}

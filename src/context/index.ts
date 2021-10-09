import amqplib from 'amqplib';
import { AmqpClient } from '../infrastructure/messaging/AmqpClient';

let amqpClient: AmqpClient;

export interface ContextConfig {
  amqp: {
    host: string;
    port: number;
    username: string;
    password: string;
    vhost: string;
  };
}

async function initializeContext(config: ContextConfig): Promise<void> {
  const { username, password, host, port, vhost } = config.amqp;
  const amqpUrl = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

  try {
    const amqpChannel = await (await amqplib.connect(amqpUrl)).createChannel();
    amqpClient = new AmqpClient(amqpChannel);
    console.log('Context initialized successfully');
  } catch (e) {
    console.log('Error initializing context');
    console.error(e);
  }
}

export { amqpClient, initializeContext };

import amqplib from 'amqplib';
import config from '../config/config.json';
import { AmqpClient } from "../infrastructure/messaging/AmqpClient";

const { username, password, host, port, vhost } = config.amqp;
const amqpUrl = `amqp://${username}:${password}@${host}:${port}/${vhost}`;

let amqpClient: AmqpClient;
async function initializeContext(): Promise<void> {
  try {
    const amqpChannel = await (await amqplib.connect(amqpUrl)).createChannel();
    amqpClient = new AmqpClient(amqpChannel);
    console.log("Context initialized successfully");
  } catch (e) {
    console.log("Error initializing context");
    console.error(e);
  }
}

export { amqpClient, initializeContext };

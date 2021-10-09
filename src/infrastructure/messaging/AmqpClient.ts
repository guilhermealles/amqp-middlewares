import amqplib from 'amqplib';
import { Message } from '../../model/Message';

export class AmqpClient {
  #channel: amqplib.Channel;

  constructor(channel: amqplib.Channel) {
    this.#channel = channel;
  }

  publishMessage(exchange: string, routingKey: string, message: Message): void {
    this.checkIfChannelIsValid();
    this.#channel.publish(exchange, routingKey, Buffer.from(message.payload), {
      headers: message.headers,
    });
  }

  async consumeMessage(queue: string): Promise<Message | null> {
    this.checkIfChannelIsValid();
    await this.#channel.assertQueue(queue);
    const message = await this.#channel.get(queue);
    let response = null;
    if (message) {
      this.#channel.ack(message);
      response = new Message(
        message.content.toString(),
        message.properties.headers,
      );
    }
    return response;
  }

  private checkIfChannelIsValid() {
    if (!this.#channel) {
      throw new Error(
        'Channel does not exist anymore. It was probably killed.',
      );
    }
  }
}

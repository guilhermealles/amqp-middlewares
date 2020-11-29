import { Message } from "../../model/Message";
import amqplib from "amqplib";
import config from "../../config/config.json";

export class AmqpClient {
  #connection?: amqplib.Connection;
  #channel?: amqplib.Channel;

  async initialize(): Promise<void> {
    const { username, password, host, port, vhost } = config.amqp;
    const uri = this.buildAmqpUri(username, password, host, port, vhost);
    try {
      this.#connection = await amqplib.connect(uri);
      this.#channel = await this.#connection.createChannel();
    } catch (e) {
      console.error(e);
    }
  }

  publishMessage(exchange: string, routingKey: string, message: Message): void {
    if (this.#channel) {
      this.#channel.publish(
        exchange,
        routingKey,
        Buffer.from(message.payload),
        { headers: message.headers }
      );
    }
  }

  async consumeMessage(queue: string): Promise<Message | null> {
    this.checkIfChannelIsValid();
    await this.#channel?.assertQueue(queue);
    const message = await this.#channel?.get(queue);
    let response = null;
    if (message) {
      this.#channel?.ack(message);
      response = new Message(
        message.content.toString(),
        message.properties.headers
      );
    }
    return response;
  }

  private buildAmqpUri(
    username: string,
    password: string,
    host: string,
    port: number,
    vhost: string
  ): string {
    return `amqp://${username}:${password}@${host}:${port}/${vhost}`;
  }

  private checkIfChannelIsValid() {
    if (!this.#channel) {
      throw new Error(
        "Channel does not exist anymore. It was probably killed."
      );
    }
  }
}

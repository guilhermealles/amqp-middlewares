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
    let message: Message | null = null;
    if (this.#channel) {
      await this.#channel?.assertQueue(queue);
      await this.#channel.consume(queue, (msg) => {
        if (msg !== null) {
          message = new Message(msg.content.toString(), msg.properties.headers);
          this.#channel?.ack(msg);
        }
      });
    }
    return message;
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
}

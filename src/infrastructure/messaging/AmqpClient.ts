import amqplib from "amqplib";

export class AmqpClient {
  #connection?: amqplib.Connection;
  #channel?: amqplib.Channel;

  async initialize(): Promise<void> {
    try {
      this.#connection = await amqplib.connect("amqp://localhost");
      this.#channel = await this.#connection.createChannel();
    } catch (e) {
      console.error(e);
    }
  }

  publishMessage(exchange: string, routingKey: string, message: string): void {
    if (this.#channel) {
      this.#channel.publish(exchange, routingKey, Buffer.from(message));
    }
  }
}

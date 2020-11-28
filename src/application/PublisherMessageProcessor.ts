import { MessageProcessor } from "./MessageProcessor";
import { AmqpClient } from "../infrastructure/messaging/AmqpClient";
import { Message } from "../model/Message";

export class PublisherMessageProcessor implements MessageProcessor {
  #amqpClient: AmqpClient;
  #exchange: string;
  #routingKey: string;

  constructor(amqpClient: AmqpClient, exchange: string, routingKey: string) {
    this.#amqpClient = amqpClient;
    this.#exchange = exchange;
    this.#routingKey = routingKey;
  }

  handle(message: Message): Promise<Message> {
    console.debug(`publishing message: ${message.payload}`);
    this.#amqpClient.publishMessage(this.#exchange, this.#routingKey, message);
    return Promise.resolve(message);
  }
}

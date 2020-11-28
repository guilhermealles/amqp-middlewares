import { FilterMessageProcessor } from "./application/FilterMessageProcessor";
import { MessagingPipeline } from "./application/MessagingPipeline";
import { PublisherMessageProcessor } from "./application/PublisherMessageProcessor";
import { TimestamperMessageProcessor } from "./application/TimestamperMessageProcessor";
import { amqpClient } from "./context";
import { Message } from "./model/Message";

const messagingPipeline = new MessagingPipeline([
  new TimestamperMessageProcessor(),

  new FilterMessageProcessor(
    (message) => parseInt(message.headers["timestamp"]) % 2 === 0
  ),

  new PublisherMessageProcessor(amqpClient, "", "alles.test.2"),
]);

export function launch(): void {
  for (let i = 0; i < 1000; i++) {
    const message = new Message(JSON.stringify({ index: i, version: 2 }));
    messagingPipeline.run(message);
  }
}

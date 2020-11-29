import { FilterMessageProcessor } from "./application/FilterMessageProcessor";
import { MessagingPipeline } from "./application/MessagingPipeline";
import { PublisherMessageProcessor } from "./application/PublisherMessageProcessor";
import { TimestamperMessageProcessor } from "./application/TimestamperMessageProcessor";
import { amqpClient } from "./context";

const SOURCE_QUEUE = "test.queue.1";
const TARGET_EXCHANGE = "exchange";
const TARGET_ROUTING_KEY = "target.rk";

const MESSAGING_PIPELINE = new MessagingPipeline([
  new TimestamperMessageProcessor(),

  new FilterMessageProcessor(() => false),

  new PublisherMessageProcessor(
    amqpClient,
    TARGET_EXCHANGE,
    TARGET_ROUTING_KEY
  ),
]);

export async function launch(): Promise<void> {
  for (let i = 0; i < 100; i++) {
    const message = await amqpClient.consumeMessage(SOURCE_QUEUE);
    console.log(message);
    await MESSAGING_PIPELINE.run(message);
  }
}

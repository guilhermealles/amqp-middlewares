import { FilterMessageProcessor } from "./application/FilterMessageProcessor";
import { MessagingPipeline } from "./application/MessagingPipeline";
import { PublisherMessageProcessor } from "./application/PublisherMessageProcessor";
import { TimestamperMessageProcessor } from "./application/TimestamperMessageProcessor";
import { amqpClient } from "./context";

const MESSAGING_PIPELINE = new MessagingPipeline([
  new TimestamperMessageProcessor(),

  new FilterMessageProcessor(() => false),

  new PublisherMessageProcessor(amqpClient, "", "alles.test.1"),
]);

export async function launch(): Promise<void> {
  for (let i = 0; i < 100; i++) {
    const message = await amqpClient.consumeMessage("alles.test.1");
    console.log(message);
    await MESSAGING_PIPELINE.run(message);
  }
}

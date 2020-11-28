// import { FilterMessageProcessor } from "./application/FilterMessageProcessor";
// import { MessagingPipeline } from "./application/MessagingPipeline";
// import { PublisherMessageProcessor } from "./application/PublisherMessageProcessor";
// import { TimestamperMessageProcessor } from "./application/TimestamperMessageProcessor";
import { amqpClient } from "./context";
// import { Message } from "./model/Message";

// const MESSAGING_PIPELINE = new MessagingPipeline([
//   new TimestamperMessageProcessor(),

//   new FilterMessageProcessor(
//     (message) => parseInt(message.headers["timestamp"]) % 2 === 0
//   ),

//   new PublisherMessageProcessor(amqpClient, "", "alles.test.2"),
// ]);

export async function launch(): Promise<void> {
  const MAX_MESSAGES = 1000;

  for (let i = 0; i < MAX_MESSAGES; i++) {
    const message = await amqpClient.consumeMessage("alles.test.2");
    console.log(message);
  }

  // for (let i = 0; i < 1000; i++) {
  //   const message = new Message(JSON.stringify({ index: i, version: 2 }));
  //   MESSAGING_PIPELINE.run(message);
  // }
}

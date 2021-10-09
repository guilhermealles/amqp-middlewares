import { MessagingPipeline } from './application/MessagingPipeline';
import { PublisherMessageProcessor } from './application/PublisherMessageProcessor';
import { TimestamperMessageProcessor } from './application/TimestamperMessageProcessor';
import { amqpClient } from './context';
import { initializeContext } from './context';
import config from './config/config.json';

const TARGET_EXCHANGE = '';
const TARGET_ROUTING_KEY = 'queue-2';

async function launch(): Promise<void> {
  const MESSAGING_PIPELINE = new MessagingPipeline([
    new TimestamperMessageProcessor(),

    new PublisherMessageProcessor(
      amqpClient,
      TARGET_EXCHANGE,
      TARGET_ROUTING_KEY,
    ),
  ]);

  for (let i = 0; i < 100; i++) {
    const message = await amqpClient.consumeMessage('queue-1');
    await MESSAGING_PIPELINE.run(message);
  }
}

initializeContext(config)
  .then(async () => {
    await launch();
  })
  .then(() => {
    process.exit(0);
  });

import { MessagingPipeline } from './application/MessagingPipeline';
import { PublisherMessageProcessor } from './application/PublisherMessageProcessor';
import { TimestamperMessageProcessor } from './application/TimestamperMessageProcessor';
import { AmqpClientFactory } from './infrastructure/messaging/AmqpClientFactory';
import config from './config/config.json';

const TARGET_EXCHANGE = '';
const TARGET_ROUTING_KEY = 'queue-1';

async function launch(): Promise<void> {
  const amqpClient = await AmqpClientFactory.GetClientInstance(config);

  const MESSAGING_PIPELINE = new MessagingPipeline([
    new TimestamperMessageProcessor(),

    new PublisherMessageProcessor(
      amqpClient,
      TARGET_EXCHANGE,
      TARGET_ROUTING_KEY,
    ),
  ]);

  for (let i = 0; i < 100; i++) {
    const message = await amqpClient.consumeMessage('queue-2');
    await MESSAGING_PIPELINE.run(message);
  }
}

(async () => {
  try {
    await launch();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

import amqplib from 'amqplib';
import { AmqpClient } from '../infrastructure/messaging/AmqpClient';
import { Message } from '../model/Message';
import { getMockChannel } from './fixtures/amqpClient';

describe('AmqpClient', () => {
  let amqpClient: AmqpClient;
  let channel: amqplib.Channel;

  const anExchange = 'test.exchange';
  const aRoutingKey = 'a-routing-key';
  const aMessage = new Message('this is the message payload');

  beforeEach(() => {
    jest.clearAllMocks();
    channel = getMockChannel();
    amqpClient = new AmqpClient(channel);
  });

  it('sends message to channel', () => {
    amqpClient.publishMessage(anExchange, aRoutingKey, aMessage);

    expect(channel?.publish).toHaveBeenCalledWith(
      anExchange,
      aRoutingKey,
      Buffer.from(aMessage.payload),
      { headers: aMessage.headers },
    );
  });
});

# amqp-middlewares

amqp-middlewares is a toolset to create message processors for AMQP message brokers. It exports a `MessagingPipeline`, which allows the combination of message processors to filter, manipulate, consume from, and publish to AMQP queues. `amqp-middlewares` also exports a `MessageProcessor` interface, which you can implement to create custom message processors to fulfill other needs.

## Installation

You can install `amqp-middlewares` with `npm`:

```bash
npm install amqp-middlewares
```

## Getting started

After installing the package, you can import the tools to create a pipeline and process messages.

### Including a timestamp header and publishing a message

The following example will show you how to use the messaging pipeline to achieve two things: add a "timestamp" header to a message and publish it to the `"sample"` exchange with the `"operation"` routing key.

```javascript

import { Message, MessagingPipeline, PublisherMessageProcessor, AmqpClientFactory } from 'amqp-middlewares';

...
// Define a basic config for the AmqpClient
const config = {
  host: 'my-amqp-host',
  port: 5672,
  username: 'my-username',
  password: 'my-password',
  vhost: '/'
}

// Then, create an AmqpClient using the factory
const amqpClient = await AmqpClientFactory.GetClientInstance(config);

// Build your messaging pipeline. We'll use two processors for this pipeline
const pipeline = new MessagingPipeline([
  new TimestamperMessageProcessor(),
  new PublisherMessageProcessor(amqpClient, 'sample', 'operation')
]);

/*
  We can then create our message and run it through the pipeline. The message 
  processors are executed in the order that they are defined.
*/

const message = new Message('Hello, world!');
await pipeline.run(message);

/*
  At this point, we can expect the message to have been published to the
  "sample" exchange with the "operation" routing key. The 
  TimestamperMessageProcessor should also have added a "timestamp" header to
  the message.
*/
```

### Creating a custom message processor

`amqp-middlewares` exports a `MessageProcessor` interface, which can be used to add custom functionality to a messaging pipeline. To create a custom message processor, all you need to do implement the `MessageProcessor` interface in a new class and pass it along to the messaging pipeline.

The `MessageProcessor` interface defines a `handle` function, which receives a `Message` as the only parameter. The `handle` function returns a Promise, which must resolve to either of the two possible values:

- A new `Message`, which will be passed along to the next processor in the pipeline;
- `null`, which will stop the execution of the `MessagingPipeline`.


The following example shows how to create a message processor that adds a new `timestamp` field to a JSON message.

```javascript
import { MessageProcessor, Message } from 'amqp-middlewares';

class JSONTimestamperMessageProcessor implements MessageProcessor {

  function handle(message: Message): Promise<Message | null> {
    const content = JSON.parse(message.payload);

    content['timestamp'] = new Date.getTime();
    const newPayload = JSON.stringify(content);

    return Promise.resolve(new Message(newPayload, message.headers));
  }
}

```

You can now create a pipeline with the new message processor, as such:

```javascript
const pipeline = new MessagingPipeline([
  new JSONTimestamperMessageProcessor()
]);

```
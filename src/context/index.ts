import { AmqpClient } from "../infrastructure/messaging/AmqpClient";

const amqpClient = new AmqpClient();

async function initializeContext(): Promise<void> {
  try {
    await amqpClient.initialize();
    console.log("Context initialized successfully");
  } catch (e) {
    console.log("Error initializing context");
    console.error(e);
  }
}

export { amqpClient, initializeContext };

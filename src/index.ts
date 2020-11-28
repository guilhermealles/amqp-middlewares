import { amqpClient, initializeContext } from "./context";

initializeContext().then(() => {
  for (let i = 0; i < 1000000; i++) {
    console.log(`sending message... ${i}`);
    amqpClient.publishMessage("", "alles.test.1", JSON.stringify({ index: i }));
  }
});

import { amqpClient } from "./context";
import { Message } from "./model/Message";

export function launch(): void {
  for (let i = 0; i < 1000; i++) {
    console.log(`sending message... ${i}`);
    amqpClient.publishMessage(
      "",
      "alles.test.1",
      new Message(JSON.stringify({ index: i }), {
        timestamp: Date.now().toString(),
      })
    );
  }
}

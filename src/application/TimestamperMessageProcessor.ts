import { Message } from "../model/Message";
import { MessageProcessor } from "./MessageProcessor";

export class TimestamperMessageProcessor implements MessageProcessor {
  handle(message: Message): Promise<Message> {
    message.headers["timestamp"] = Date.now().toString();
    return Promise.resolve(message);
  }
}

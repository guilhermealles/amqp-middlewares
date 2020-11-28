import { Message } from "../model/Message";

export interface MessageProcessor {
  handle: (message: Message) => Promise<Message | null>;
}

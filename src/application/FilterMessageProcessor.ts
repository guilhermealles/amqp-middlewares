import { Message } from "../model/Message";
import { MessageProcessor } from "./MessageProcessor";

export class FilterMessageProcessor implements MessageProcessor {
  #filteringCondition: (message: Message) => boolean;

  constructor(filteringCondition: (message: Message) => boolean) {
    this.#filteringCondition = filteringCondition;
  }

  handle(message: Message): Promise<Message | null> {
    const messageShouldBeFiltered = this.#filteringCondition(message);
    if (messageShouldBeFiltered) {
      return Promise.resolve(null);
    } else {
      return Promise.resolve(message);
    }
  }
}

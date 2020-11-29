import { Message } from "../model/Message";
import { MessageProcessor } from "./MessageProcessor";

export class MessagingPipeline {
  #messageProcessors: MessageProcessor[];

  constructor(processors: MessageProcessor[]) {
    this.#messageProcessors = processors;
  }

  async run(message: Message | null): Promise<void> {
    let currentMessage = message;
    for (let i = 0; i < this.#messageProcessors.length; i++) {
      if (currentMessage) {
        currentMessage = await this.#messageProcessors[i].handle(
          currentMessage
        );
      } else {
        console.debug("Empty message in the pipeline. Skipping.");
        break;
      }
    }
  }
}

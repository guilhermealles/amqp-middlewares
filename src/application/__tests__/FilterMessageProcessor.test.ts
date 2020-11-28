import { Message } from "../../model/Message";
import { FilterMessageProcessor } from "../FilterMessageProcessor";

describe("FilterMessageProcessor", () => {
  const message = new Message("this is a message", { header: "value" });

  it("resolves to the same message if the condition is false", async () => {
    const filterMessageProcessor = new FilterMessageProcessor(() => false);
    const result = await filterMessageProcessor.handle(message);
    expect(result).toEqual(message);
  });

  it("resolves to a null message if condition is true", async () => {
    const filterMessageProcessor = new FilterMessageProcessor(() => true);
    const result = await filterMessageProcessor.handle(message);
    expect(result).toBeNull();
  });

  describe("conditions", () => {
    it("filters message with the condition function", async () => {
      const filterMessageProcessor = new FilterMessageProcessor(
        (currentMessage) => currentMessage.payload === "this is a message"
      );
      const result = await filterMessageProcessor.handle(message);
      expect(result).toEqual(null);
    });

    it("keeps message with the condition function", async () => {
      const filterMessageProcessor = new FilterMessageProcessor(
        (currentMessage) => currentMessage.payload !== "this is a message"
      );
      const result = await filterMessageProcessor.handle(message);
      expect(result).toEqual(message);
    });
  });
});

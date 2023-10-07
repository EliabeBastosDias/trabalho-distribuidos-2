import { MessageRepository } from "../repositories";

export class MessageConsumer {
  private static instance: MessageConsumer;

  public static getInstance(
    messageRepository: MessageRepository
  ): MessageConsumer {
    if (!MessageConsumer.instance) {
      const instance = new MessageConsumer(
        messageRepository
      );
      MessageConsumer.instance = instance;
    }
    return MessageConsumer.instance;
  }

  private constructor(private messageRepository: MessageRepository) {}
}

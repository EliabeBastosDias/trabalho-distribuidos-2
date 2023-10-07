import {
  EcgMessageEntity,
  LightMessageEntity,
  TemperatureMessageEntity,
} from "../entities";
import { Stack } from "../utils/stack";

export class MessageRepository {
  private static instance: MessageRepository;

  public static getInstance(
    temperatureStack: Stack<TemperatureMessageEntity>,
    lightStack: Stack<LightMessageEntity>,
    ecgStack: Stack<EcgMessageEntity>
  ): MessageRepository {
    if (!MessageRepository.instance) {
      const instance = new MessageRepository(
        temperatureStack,
        lightStack,
        ecgStack
      );
      MessageRepository.instance = instance;
    }
    return MessageRepository.instance;
  }

  private constructor(
    private temperatureStack: Stack<TemperatureMessageEntity>,
    private lightStack: Stack<LightMessageEntity>,
    private ecgStack: Stack<EcgMessageEntity>
  ) {}
}

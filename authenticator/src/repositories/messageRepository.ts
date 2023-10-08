import {
  ConditionalMessageEntity,
  LightMessageEntity,
  TemperatureMessageEntity,
} from "../entities";

export class MessageRepository {
  private static instance: MessageRepository;

  public static getInstance(
    temperatureList: TemperatureMessageEntity[],
    lights: LightMessageEntity[],
    airs: ConditionalMessageEntity[]
  ): MessageRepository {
    if (!MessageRepository.instance) {
      const instance = new MessageRepository(temperatureList, lights, airs);
      MessageRepository.instance = instance;
    }
    return MessageRepository.instance;
  }

  private constructor(
    private temperatureList: TemperatureMessageEntity[],
    private lights: LightMessageEntity[],
    private airs: ConditionalMessageEntity[]
  ) {}

  public getIotData(type: string): string {
    if (type === "TEMPERATURE") {
      return this.temperatureList.map((t) => t.number).toString();
    } else if (type === "LIGHT") {
      return this.lights.toString();
    } else if (type === "AIR CONDITIONING") {
      return this.airs.toString();
    }
    return "";
  }
}

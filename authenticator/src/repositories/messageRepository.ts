import {
  ConditionalMessageEntity,
  LightMessageEntity,
  TemperatureMessageEntity,
} from "../entities";

export class MessageRepository {
  private static instance: MessageRepository;

  public static getInstance(
    temperatures: TemperatureMessageEntity[],
    lights: LightMessageEntity[],
    airs: ConditionalMessageEntity[]
  ): MessageRepository {
    if (!MessageRepository.instance) {
      const instance = new MessageRepository(temperatures, lights, airs);
      MessageRepository.instance = instance;
    }
    return MessageRepository.instance;
  }

  private constructor(
    private temperatures: TemperatureMessageEntity[],
    private lights: LightMessageEntity[],
    private airs: ConditionalMessageEntity[]
  ) {}

  public getIotData(type: string): string {
    if (type === "TEMPERATURE") {
      return this.temperatures.map((t) => t.data).toString();
    } else if (type === "LIGHT") {
      return this.lights.toString();
    } else if (type === "AIR") {
      return this.airs.toString();
    }
    return "";
  }

  public setIotData(data: string, created_at: string, type: string): void {
    if (type === "TEMPERATURE") {
      this.temperatures.push({ token: "1", data, created_at });
    } else if (type === "LIGHT") {
      return;
    } else if (type === "AIR") {
      return;
    }
  }
}

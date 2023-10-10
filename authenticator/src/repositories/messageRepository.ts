import {
  AirMessageEntity,
  LightMessageEntity,
  TemperatureMessageEntity,
} from "../entities";

export class MessageRepository {
  private static instance: MessageRepository;

  public static getInstance(
    temperatures: TemperatureMessageEntity[],
    lights: LightMessageEntity[],
    airs: AirMessageEntity[]
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
    private airs: AirMessageEntity[]
  ) {}

  public getIotData(type: string): string {
    if (type === "TEMPERATURE") {
      const arr: string[] = [];
      this.temperatures.forEach((t) => {
        arr.push(`==> ${new Date(t.created_at).toUTCString()} => ${t.data}\n`);
      });
      return arr.join("");
    } else if (type === "LIGHT") {
      const arr: string[] = [];
      this.lights.forEach((t) =>
        arr.push(
          `==> ${new Date(t.created_at).toUTCString()} => ${
            t.data ? "LIGADO" : "DESLIGADO"
          }\n`
        )
      );
      return arr.join("");
    } else if (type === "AIR") {
      return this.airs.join(" , ");
    }
    return "";
  }

  public setIotData(data: string, type: string): void {
    if (type === "TEMPERATURE") {
      if (this.temperatures.length > 30) this.temperatures.shift();
      this.temperatures.push({
        data,
        created_at: new Date().getTime(),
      });
    } else if (type === "LIGHT") {
      if (this.lights.length > 30) this.lights.shift();
      this.lights.push({
        data: data === "ON",
        created_at: new Date().getTime(),
      });
    } else if (type === "AIR") {
      if (this.airs.length > 30) this.airs.shift();
      this.airs.push({
        data: parseFloat(data),
        created_at: new Date().getTime(),
      });
    }
  }
}

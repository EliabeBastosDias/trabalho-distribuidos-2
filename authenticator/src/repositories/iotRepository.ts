import { IotUserEntity } from "../entities";

export class IotRepository {
  private static instance: IotRepository;

  public static getInstance(iotUsers: IotUserEntity[]): IotRepository {
    if (!IotRepository.instance) {
      const instance = new IotRepository(iotUsers);
      IotRepository.instance = instance;
    }
    return IotRepository.instance;
  }

  private constructor(private iotUsers: IotUserEntity[]) {}

  public saveIotUser(address: string, port: number, type: string): void {
    if (!this.iotUsers.map((i) => i.port).includes(port)) {
      this.iotUsers.push({ address, port, type });
    }
  }

  public getIotUser(type: string): IotUserEntity | undefined {
    return this.iotUsers.find((i) => i.type === type);
  }
}

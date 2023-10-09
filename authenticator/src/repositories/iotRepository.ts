import { IotUserEntity } from "../entities";
import { IotType } from "../entities/iot.entity";

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

  public saveIotUser(address: string, port: number, type: IotType): void {
    if (this.iotUsers.find((user) => user.address === address)) {
      this.iotUsers.push({ address, port, type });
    }
  }
}

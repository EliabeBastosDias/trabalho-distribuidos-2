import { IotType } from "../entities/iot.entity";

export type EventEntity = {
  type: IotType;
  state: string;
};

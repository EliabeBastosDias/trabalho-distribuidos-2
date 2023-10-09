export type IotUserEntity = {
  address: string;
  port: number;
  type: IotType;
};

export enum IotType {
  LIGHT = "LIGHT",
  TEMPERATURE = "TEMPERATURE",
  AIR_CONDITIONING = "AIR CONDITIONING",
}

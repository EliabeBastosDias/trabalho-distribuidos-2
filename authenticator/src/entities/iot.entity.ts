export type IotUserEntity = {
  ip: string;
  type: IotType;
};

export enum IotType {
  LIGHT = "LIGHT",
  TEMPERATURE = "TEMPERATURE",
  AIR_CONDITIONING = "AIR CONDITIONING",
}

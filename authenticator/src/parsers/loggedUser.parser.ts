import { IAuthenticatiorParams, IFinishParams } from "../interfaces";

export function parseAuthLoggedUser(data: any): IAuthenticatiorParams {
  return {
    login: data.login as string,
    password: data.password ? (data.password as string) : undefined,
    adress: data.adress as string,
    port: data.port as string,
  };
}

export function parseFinishLoggedUser(data: any): IFinishParams {
  return {
    login: data.login,
  };
}

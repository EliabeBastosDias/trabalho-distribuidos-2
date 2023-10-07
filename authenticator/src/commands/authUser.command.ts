import { IAuthenticatiorParams } from "../interfaces";
import { UserRepository } from "../repositories/userRepository";

export interface IAuthUserResult {
  isAuthenticated: boolean;
  loggedUntil?: number;
}

export class AuthUserCommand {
  constructor(private userRepository: UserRepository) {}

  public execute(params: IAuthenticatiorParams): IAuthUserResult {
    const { login, password } = params;

    const loggedUser = this.userRepository.getLoggedUserByLogin(login);
    if (loggedUser) return this.buildAuthResult(true);

    const success = this.userRepository.loginUser(login ?? "", password ?? "");
    if (!success) return this.buildAuthResult(false);

    return this.buildAuthResult(true);
  }

  private buildAuthResult(isAuthenticated: boolean): IAuthUserResult {
    if (isAuthenticated) {
      console.log("Cliente conectado.");
    } else {
      console.log("Cliente não conectado.");
    }

    return {
      isAuthenticated,
      loggedUntil: isAuthenticated ? new Date().getTime() : undefined,
    };
  }
}

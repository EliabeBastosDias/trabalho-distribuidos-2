import { IAuthenticatiorParams } from "../interfaces";
import { UserRepository } from "../repositories/userRepository";

export class AuthUserCommand {
  constructor(private userRepository: UserRepository) {}

  public execute(params: IAuthenticatiorParams): string {
    const { login, password } = params;

    const loggedUser = this.userRepository.getLoggedUserByLogin(login);
    if (loggedUser) return loggedUser.token;

    const user = this.userRepository.loginUser(login, password);
    if (user) return user.token;

    throw Error("Login error");
  }
}

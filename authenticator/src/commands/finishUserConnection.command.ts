import { IFinishParams } from "../interfaces";
import { UserRepository } from "../repositories";

export class FinishUserConnectionCommand {
  constructor(private userRepository: UserRepository) {}

  public execute(params: IFinishParams): void {
    const { login } = params;
    const user = this.userRepository.getLoggedUserByLogin(login);

    if (!user) console.log("Cliente não encontrado.");

    this.userRepository.deleteLoggedUser(login);

    console.log("Cliente desconectado.");
  }
}

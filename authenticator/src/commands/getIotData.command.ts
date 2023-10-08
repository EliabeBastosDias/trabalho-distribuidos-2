import { IGetIotParams } from "../interfaces/getIotData.interface";
import { MessageRepository, UserRepository } from "../repositories";

export class GetIotData {
  constructor(
    private userRepository: UserRepository,
    private messageRepository: MessageRepository
  ) {}

  public execute(params: IGetIotParams): string {
    const loggedUser = this.userRepository.getLoggedUserByToken(
      params.token
    );

    if (!loggedUser) throw new Error("Logged user not found");
    // this.userRepository.updateLoggedUntil()

    const data = this.messageRepository.getIotData(params.type);
    return data;
  }
}

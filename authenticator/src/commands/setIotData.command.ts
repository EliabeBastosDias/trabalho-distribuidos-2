import { ISetIotParams } from "../interfaces/setIotData.interface";
import { MessageRepository, UserRepository } from "../repositories";

export class SetIotData {
  constructor(private messageRepository: MessageRepository) {}

  public execute(params: ISetIotParams): void {
    this.messageRepository.setIotData(
      params.data,
      params.created_at,
      params.type
    );
  }
}

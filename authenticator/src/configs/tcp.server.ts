import * as net from "net";

import { MessageRepository } from "../repositories";
import { AuthUserCommand } from "../commands";
import { FinishUserConnectionCommand } from "../commands/finishUserConnection.command";
import { UserRepository } from "../repositories";
import * as parsers from "../parsers/loggedUser.parser";

const PORT = 3001;
const ADDRESS = '127.0.0.6';

export class TcpServerHandler {
  constructor(
    private userRepository: UserRepository,
    private messageRepository: MessageRepository
  ) {}

  public create(): void {
    const server = net.createServer((socket) => {
      socket.on("auth", (data: any) => {
        console.log(data);
        /* const executeParams = parsers.parseAuthLoggedUser(data);
        const command = new AuthUserCommand(this.userRepository);
        const result = command.execute(executeParams);
        return result; */
      });

      socket.on("user_message", (data: any) => {
        console.log(data);
      });

      /* socket.on("receive_iot_message", (data: any) =>
        console.log(`Dados recebidos do iot: ${data}`)
      ); */

      socket.on("end", (data: any) => {
        const executeParams = parsers.parseFinishLoggedUser(data);
        const command = new FinishUserConnectionCommand(this.userRepository);
        const result = command.execute(executeParams);
        return result;
      });
    });

    server.listen(PORT, ADDRESS, () => {
      console.log(`Servidor de autenticação TCP ouvindo em ${ADDRESS}:${PORT}`);
    });
  }
}

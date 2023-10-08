import * as net from "net";
import protobufjs from "protobufjs";

import { MessageRepository } from "../repositories";
import { AuthUserCommand } from "../commands";
import { UserRepository } from "../repositories";
import { GetIotData } from "../commands/getIotData.command";

const PORT = 3001;
const ADDRESS = "127.0.0.6";

export class TcpServerHandler {
  constructor(
    private userRepository: UserRepository,
    private messageRepository: MessageRepository
  ) {}

  public async create(): Promise<void> {
    const root = await protobufjs.load("chat.proto");
    const request = root.lookupType("Request");
    const response = root.lookupType("Response");

    const server = new net.Server();

    server.listen(PORT, ADDRESS, () => {
      console.log(`Servidor de autenticação TCP ouvindo em ${ADDRESS}:${PORT}`);
    });

    server.on("connection", (socket) => {
      socket.on("data", (data: any) => {
        const message = request.decode(data);
        const object = request.toObject(message);

        console.log("Requisição => ", object);

        if (object.action === "auth") {
          const executeParams = {
            login: object.login,
            password: object.password,
          };
          const command = new AuthUserCommand(this.userRepository);
          const token = command.execute(executeParams);

          console.log("Cliente conectado");

          const responseMessage = response.create({ token });
          const encode = response.encode(responseMessage).finish();
          socket.write(encode);
        }

        if (object.action === "client_request") {
          console.log("entrei no client_request");
          const executeParams = {
            token: object.token,
            type: object.type,
          };
          const command = new GetIotData(
            this.userRepository,
            this.messageRepository
          );
          const result = command.execute(executeParams);

          const encode = response.encode({ info: result }).finish();
          socket.write(encode);
        }
      });
    });
  }
}

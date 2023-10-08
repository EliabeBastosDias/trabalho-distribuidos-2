import * as net from "net";
import dgram from "node:dgram";

import protobufjs from "protobufjs";

import { MessageRepository, UserRepository } from "../repositories";

const PORT = 3002;
const ADDRESS = "127.0.0.6";

export class UdpServerHandler {
  constructor(
    private userRepository: UserRepository,
    private messageRepository: MessageRepository
  ) {}

  public async create(): Promise<void> {
    const root = await protobufjs.load("chat.proto");
    const request = root.lookupType("Request");
    const response = root.lookupType("Response");

    const server = dgram.createSocket("udp4");
    server.on("message", (msg, rinfo) => {
      console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    server.on("listening", () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(PORT);
  }
}

import * as net from "net";
import dgram from "node:dgram";

import protobufjs from "protobufjs";

import { MessageRepository, UserRepository } from "../repositories";

const PORT = 60000;
const ADDRESS = "127.0.0.6";

export class UdpServerHandler {
  constructor(
    private userRepository: UserRepository,
    private messageRepository: MessageRepository
  ) {}

  public async create(): Promise<void> {
    const root = await protobufjs.load("chat.proto");
    const iotRequest = root.lookupType("IOTRequest");

    const server = dgram.createSocket("udp4");
    server.on("message", (data, rinfo) => {
      const message = iotRequest.decode(data);
      const iotMessage = iotRequest.toObject(message);
      
      switch(iotMessage.type){
        case "connection":
          console.log(`Salvar objeto ${iotMessage.object} com endereço: ${iotMessage.value}`)
          const address = server.address();
          let message = iotRequest.create({type: "connection", object: "", value: `${address.address}:${address.port}`})
          const buffer = iotRequest.encode(message).finish()
          server.send(buffer, rinfo.port, rinfo.address, (err) => {
            if (err) console.error('Failed to send response !!')
            else console.log('Response send Successfully')
          })
          break
        case "update_value":
          console.log(`Salvar novo valor do objeto ${iotMessage.object}. Novo valor: ${iotMessage.value}`)
      }
    });

    server.on("listening", () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(PORT, ADDRESS);
  }
}

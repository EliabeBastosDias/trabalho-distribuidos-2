import dgram from "node:dgram";

import protobufjs from "protobufjs";

import { MessageRepository } from "../repositories";
import { IotRepository } from "../repositories/iotRepository";
import { EventHandler } from "../events";

const PORT = 60000;
const ADDRESS = "127.0.0.6";

export class UdpServerHandler {
  constructor(
    private iotRepository: IotRepository,
    private messageRepository: MessageRepository,
    private eventHandler: EventHandler
  ) {}

  public async create(): Promise<void> {
    const root = await protobufjs.load("chat.proto");
    const iotRequest = root.lookupType("IOTRequest");

    const server = dgram.createSocket("udp4");
    server.on("message", (data, rinfo) => {
      const message = iotRequest.decode(data);
      const iotObject = iotRequest.toObject(message);

      this.iotRepository.saveIotUser(
        iotObject.address,
        iotObject.port,
        iotObject.type
      );

      switch (iotObject.type) {
        case "connection":
          const address = server.address();
          let message = iotRequest.create({
            type: "connection",
            object: "",
            value: `${address.address}:${address.port}`,
          });

          const buffer = iotRequest.encode(message).finish();
          server.send(buffer, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(`Erro: ${err}`);
          });
          break;
        case "update_value":
          const iotObject = iotRequest.decode(data);
          const object = iotRequest.toObject(iotObject);

          this.messageRepository.setIotData(object.value, object.object);
          break;
      }

      setInterval(() => {
        
      }, 2000)
    });

    server.on("listening", () => {
      const address = server.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(PORT, ADDRESS);
  }
}

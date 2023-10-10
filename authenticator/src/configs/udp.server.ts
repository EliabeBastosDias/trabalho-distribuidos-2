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
      setInterval(() => {
        const event = this.eventHandler.getFirstEvent();
        if (event && event.socket === "UDP") {
          const iot = this.iotRepository.getIotUser(event.type);
          
          if (!iot) {
            console.log("Iot not found");
            return;
          }
          const setMessage = iotRequest.create({
            type: "command",
            value: event.state,
            object: event.type,
          });
          const buffer = iotRequest.encode(setMessage).finish();
          server.send(buffer, iot.port, iot.address, (err) => {
            if (err) console.error(`Erro: ${err}`);
          });
        }
      }, 2000);

      const message = iotRequest.decode(data);
      const iotObject = iotRequest.toObject(message);

      switch (iotObject.type) {
        case "connection":
          // Save new iot object
          const [address, port] = iotObject.value.split(":");
          this.iotRepository.saveIotUser(address, port, iotObject.object);

          // Send addres to iot object
          const udpaddress = server.address();
          const connMessage = iotRequest.create({
            type: "connection",
            object: "",
            value: `${udpaddress.address}:${udpaddress.port}`,
          });

          const connBuffer = iotRequest.encode(connMessage).finish();
          server.send(connBuffer, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(`Erro: ${err}`);
          });

          // Request the initial state of object
          const message = iotRequest.create({ type: "request" });

          const requestBuffer = iotRequest.encode(message).finish();
          server.send(requestBuffer, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(`Erro: ${err}`);
          });

          console.log(" --------- Objetos conectados --------- ")
          console.log(this.iotRepository);

          break;
        case "update_value":
          this.messageRepository.setIotData(
            iotObject.value,
            iotObject.object
          );
          break;
        case "request":
          this.eventHandler.storeEvent({
            socket: "TCP",
            type: iotObject.type,
            state: iotObject.value,
          });
          break;
      }
    });

    server.on("listening", () => {
      const address = server.address();
      console.log(`Server listening ${address.address}:${address.port}`);
    });

    server.bind(PORT, ADDRESS);
  }
}

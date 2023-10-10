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
            object: "LIGHT",
          });
          const buffer = iotRequest.encode(setMessage).finish();
          server.send(buffer, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(`Erro: ${err}`);
          });
        }
      }, 2000);

      const message = iotRequest.decode(data);
      const iotObject = iotRequest.toObject(message);

      switch (iotObject.type) {
        case "connection":
          const [address, port] = iotObject.value.split(":");
          this.iotRepository.saveIotUser(address, port, iotObject.object);
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

          const message = iotRequest.create({ type: "request" });

          const requestBuffer = iotRequest.encode(message).finish();
          server.send(requestBuffer, rinfo.port, rinfo.address, (err) => {
            if (err) console.error(`Erro: ${err}`);
          });

          break;
        case "update_value":
          const updateIotObject = iotRequest.decode(data);
          const updateObject = iotRequest.toObject(updateIotObject);

          console.log(updateObject);

          this.messageRepository.setIotData(
            updateObject.value,
            updateObject.object
          );
          break;
        case "request":
          const requestIotObject = iotRequest.decode(data);
          const requestObject = iotRequest.toObject(requestIotObject);

          this.eventHandler.storeEvent({
            socket: "TCP",
            type: requestObject.type,
            state: requestObject.value,
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

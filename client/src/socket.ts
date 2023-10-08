import net from "net";
import readline from "readline";
import protobufjs, { Root } from "protobufjs";

export class Socket {
  constructor(private address: string, private port: number) {}

  public async create() {
    let authToken: string;

    const root = await protobufjs.load("chat.proto");
    const request = root.lookupType("Request");
    const response = root.lookupType("Response");

    const client = new net.Socket();

    client.connect({ port: this.port, host: this.address }, () => {
      console.log("TCP connection established with the server.");
      const message = request.create({
        action: "auth",
        login: "eliabe",
        password: "123",
      });
      const encode = request.encode(message).finish();
      client.write(encode);
    });

    client.on("data", (data) => {
      const message = response.decode(data);
      const object = response.toObject(message);

      console.log(object);

      const { token, info } = object;

      if (token) authToken = token;
      if (info) console.log(info);
    });

    setInterval(() => {
      const message = request.create({
        action: "client_request",
        token: authToken,
        type: "TEMPERATURE",
      });
      const encode = request.encode(message).finish();
      client.write(encode);
      console.log("mandei");
    }, 5000);
  }
}

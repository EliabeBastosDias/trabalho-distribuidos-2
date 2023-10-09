import net from "net";
import readlineSync from "readline-sync";
import protobufjs from "protobufjs";

export class Socket {
  constructor(private address: string, private port: number) {}

  public async create() {
    const auth = { token: "", isLogged: false };
    let wait = false;

    const root = await protobufjs.load("chat.proto");
    const request = root.lookupType("Request");
    const response = root.lookupType("Response");

    const client = net.createConnection(this.port, this.address, () => {
      console.log("TCP connection established with the server.");

      const login = readlineSync.question("Login: ");
      const password = readlineSync.question("Password: ");

      const message = request.create({
        action: "auth",
        login,
        password,
      });

      const encode = request.encode(message).finish();
      client.write(encode);

      client.on("data", (data) => {
        const message = response.decode(data);
        const object = response.toObject(message);

        const { token, info } = object;

        if (token) {
          auth.token = token;
          auth.isLogged = true;
        }
        if (info) console.log(info);
        wait = true;
      });

      setInterval(() => {
        if (wait) {
          const type = readlineSync.question(
            "Escolha o tipo de dispositivo (TEMPERATURE, LIGHT, AIR) ou 'sair' para sair: "
          );

          const message = request.create({
            action: "client_request",
            token: auth.token,
            type,
          });

          const encode = request.encode(message).finish();
          client.write(encode);
          wait = false;
        }
      }, 3000);
    });
  }
}

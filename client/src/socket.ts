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
          console.log("Devices => TEMPERATURE, LIGHT, AIR");
          const type = readlineSync.question("Escolha o dispositivo: ");
          if (["TEMPERATURE, LIGHT, AIR"].includes(type))
            console.log("Opção inválida");

          console.log("\nDigite 1 para obter dados");
          console.log("Digite 2 para setar dado em iot");
          const action = readlineSync.question("O que você quer fazer: ");
          
          if (action === "1") {
            const message = request.create({
              action: "client_request",
              token: auth.token,
              type,
            });
            const encode = request.encode(message).finish();
            client.write(encode);
          }
          if (action === "2") {
            const state = readlineSync.question("Resultado a ser setado no iot: ");
            const message = request.create({
              action: "set_iot_state",
              token: auth.token,
              type,
              state
            });
            const encode = request.encode(message).finish();
            client.write(encode);
          } else {
            console.log("Opção inválida");
          }

          wait = false;
        }
      }, 3000);
    });
  }
}

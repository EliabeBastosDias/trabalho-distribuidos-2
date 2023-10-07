import * as net from "net";

const PORT = 3001;
const ADDRESS = '127.0.0.6';

export class TcpServerHandler {
  public create(): void {
    const client = net.createConnection(PORT, ADDRESS, () => {
      console.log('Conectado ao servidor');

      const data = {
        token: "string",
        login: "string",
        password: "string",
        ip: "string",
      }

      const message = JSON.stringify(data);
    
      client.write(message);
    });

    client.on('user_message', (data) => {
      console.log('Recebido do servidor:', data.toString());
    });
  }
}

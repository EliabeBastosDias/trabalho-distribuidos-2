# Documentação

## Dependências do client
O cliente usa as seguintes bibliotecas:
- `protobufjs`: para serialização e desserialização de mensagens usando Protocol Buffers.
- `net`: para criar conexões de socket TCP.
- `readline-sync`: para ler a entrada do usuário no terminal.

## Arquivos
O cliente consiste em três arquivos principais: `index.ts`, `sockets.ts` e `chat.proto`.

### index.ts
Este arquivo contém o código que importa a classe Socket, define um host e uma porta, cria uma instância da classe Socket com esses valores e, em seguida, chama o método `create()`.

### sockets.ts
Esse arquivo implementa uma funcionalidade para estabelecer uma conexão TCP com um servidor, autenticar o usuário, interagir com dispositivos IoT e receber informações do servidor, tudo usando mensagens protobuf para comunicação estruturada.

#### Partes Principais
1. `export class Socket`: Define uma classe chamada Socket. Essa classe tem um construtor que aceita um endereço (uma string) e uma porta (um número) como argumentos. A classe possui um método público chamado create() que é responsável por criar uma conexão TCP com o servidor, realizar a autenticação e interagir com dispositivos IoT.

2. `public async create()`: Método assíncrono para criar uma conexão com o servidor remoto e iniciar a interação. Ele carrega os tipos de mensagem a partir do arquivo "chat.proto" usando o protobufjs, autentica o cliente com um login e senha fornecidos pelo usuário e permite ao usuário interagir com dispositivos IoT, solicitando dados ou configurando estados.

### chat.proto
Este arquivo define as mensagens Protocol Buffers usadas na comunicação entre o cliente e o servidor. Ele define duas mensagens:

1. `Request`: Esta mensagem é usada quando o cliente faz uma solicitação ao servidor. Ela tem seis campos:
    - `action`: uma string que representa a ação que o cliente deseja realizar.
    - `token`: uma string que representa um token de autenticação (se aplicável).
    - `login`: uma string que representa o nome de usuário para autenticação.
    - `password`: uma string que representa a senha para autenticação.
    - `type`: uma string que representa o tipo de dispositivo IoT (se aplicável).
    - `state`: uma string que representa o estado a ser configurado em um dispositivo IoT (se aplicável).

2. `Response`: Esta mensagem é usada quando o servidor envia uma resposta ao cliente. Ela tem dois campos:
    - `token`: uma string que representa um token de autenticação (se aplicável).
    - `info`: uma string que representa as informações ou mensagens enviadas pelo servidor.


## Dependências do sensores (TEMPERATURE, LIGHT, AIR)
O dispositivo usa as seguintes bibliotecas:
- `socket`: para criar e gerenciar conexões de socket UDP.
- `chat_pb2`: para serialização e desserialização de mensagens usando Protocol Buffers.
- `random`: para gerar valores aleatórios que simulem atualizações de temperatura.
- `time`: para adicionar atrasos no código, permitindo simular atualizações de temperatura.

## Arquivos
O sensor consiste em dois arquivos principais: `sensor.py` e `chat.proto`.

### chat.proto
Este arquivo define as mensagens Protocol Buffers usadas na comunicação entre o cliente e o servidor. Ele define duas mensagens:

1. `Request`: Esta mensagem é usada quando o dispositivo faz uma solicitação ao servidor. Ela tem cinco campos:
    - `action`: uma string que representa a ação que o cliente deseja realizar.
    - `token`: uma string que representa um token de autenticação (se aplicável).
    - `login`: uma string que representa o nome de usuário para autenticação.
    - `password`: uma string que representa a senha para autenticação.
    - `type`: uma string que representa o tipo de dispositivo IoT (se aplicável).

2. `Response`: Esta mensagem é usada quando o servidor envia uma resposta ao cliente. Ela tem dois campos:
    - `token`: uma string que representa um token de autenticação (se aplicável).
    - `info`: uma string que representa as informações ou mensagens enviadas pelo servidor.

3. `IoTRequest`: Esta mensagem é usada quando o servidor faz uma solicitação ao dispositivo. Ela tem três campos:
    - `type`: uma string que representa o tipo da mensagem (por exemplo, "connection" ou "update_value")
    - `object`: uma string que representa o objeto associado à mensagem (por exemplo, "TEMPERATURE" ou outro dispositivo IoT).
    - `value`: uma string que representa o valor da mensagem (pode ser uma leitura de temperatura ou outra informação)
  
Espero que esta documentação seja útil para entender como funciona o client! Se você tiver alguma dúvida, não hesite em perguntar.

import * as repositories from "./configs/repositories";
import { TcpServerHandler } from "./configs/tcp.server";
import { UdpServerHandler } from "./configs/udp.server";

new TcpServerHandler(
  repositories.userRepository,
  repositories.messageRepository
).create();

new UdpServerHandler(
  repositories.iotRepository,
  repositories.messageRepository
).create();

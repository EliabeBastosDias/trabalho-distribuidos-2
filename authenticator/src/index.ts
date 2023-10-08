import * as repositories from "./configs/repositories";
import { TcpServerHandler } from "./configs/tcp.server";
import { UdpServerHandler } from "./configs/udp.server";

const tcp = new TcpServerHandler(
  repositories.userRepository,
  repositories.messageRepository
).create();

const udp = new UdpServerHandler(
  repositories.userRepository,
  repositories.messageRepository
).create();

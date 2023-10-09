import * as repositories from "./configs/repositories";
import { TcpServerHandler } from "./configs/tcp.server";
import { UdpServerHandler } from "./configs/udp.server";
import * as events from './configs/events'

new TcpServerHandler(
  repositories.userRepository,
  repositories.messageRepository,
  events.eventHandler
).create();

new UdpServerHandler(
  repositories.iotRepository,
  repositories.messageRepository,
  events.eventHandler
).create();

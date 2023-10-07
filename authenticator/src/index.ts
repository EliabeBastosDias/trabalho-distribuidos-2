import * as repositories from './configs/repositories';
import { TcpServerHandler } from './configs/tcp.server';

new TcpServerHandler(
    repositories.userRepository,
    repositories.messageRepository,
).create();
import {
  TemperatureMessageEntity,
  LightMessageEntity,
  ConditionalMessageEntity,
  UserEntity,
  LoggedUserEntity,
} from "../entities";
import { MessageRepository, UserRepository } from "../repositories";

const STACK_LENGTH = 100;

const loggedUsers: LoggedUserEntity[] = [];
const users: UserEntity[] = [
  { token: "1", login: "eliabe", password: "123" },
  { token: "2", login: "mauricio", password: "234" },
  { token: "3", login: "weatherly", password: "345" },
  { token: "4", login: "moises", password: "456" },
];
const iotUsers: UserEntity[] = [];

const temperatures: TemperatureMessageEntity[] = [
  { token: "1", number: 34, created_at: new Date().toLocaleDateString() },
];
const lights: LightMessageEntity[] = [];
const airs: ConditionalMessageEntity[] = [];

export const userRepository = UserRepository.getInstance(users, loggedUsers);
export const messageRepository = MessageRepository.getInstance(
  temperatures,
  lights,
  airs
);

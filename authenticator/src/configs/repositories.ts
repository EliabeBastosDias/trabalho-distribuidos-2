import {
  TemperatureMessageEntity,
  LightMessageEntity,
  AirMessageEntity,
  UserEntity,
  LoggedUserEntity,
  IotUserEntity,
} from "../entities";
import { MessageRepository, UserRepository } from "../repositories";
import { IotRepository } from "../repositories/iotRepository";

const STACK_LENGTH = 100;

const loggedUsers: LoggedUserEntity[] = [];
const users: UserEntity[] = [
  { token: "1", login: "eliabe", password: "123" },
  { token: "2", login: "mauricio", password: "234" },
  { token: "3", login: "weatherly", password: "345" },
  { token: "4", login: "moises", password: "456" },
];
const iotUsers: IotUserEntity[] = [];

const temperatures: TemperatureMessageEntity[] = [];
const lights: LightMessageEntity[] = [];
const airs: AirMessageEntity[] = [];

export const userRepository = UserRepository.getInstance(users, loggedUsers);
export const messageRepository = MessageRepository.getInstance(
  temperatures,
  lights,
  airs
);
export const iotRepository = IotRepository.getInstance(iotUsers);

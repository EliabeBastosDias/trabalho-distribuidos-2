import {
  TemperatureMessageEntity,
  LightMessageEntity,
  EcgMessageEntity,
  UserEntity,
  LoggedUserEntity,
} from "../entities";
import { MessageRepository, UserRepository } from "../repositories";
import { Stack } from "../utils/stack";

const STACK_LENGTH = 100;

const loggedUsers: LoggedUserEntity[] = [];
const users: UserEntity[] = [];
const iotUsers: UserEntity[] = [];

const temperatureStack = new Stack<TemperatureMessageEntity>(STACK_LENGTH);
const lightStack = new Stack<LightMessageEntity>(STACK_LENGTH);
const ecgStack = new Stack<EcgMessageEntity>(STACK_LENGTH);

export const userRepository = UserRepository.getInstance(users, loggedUsers);
export const messageRepository = MessageRepository.getInstance(
  temperatureStack,
  lightStack,
  ecgStack
);

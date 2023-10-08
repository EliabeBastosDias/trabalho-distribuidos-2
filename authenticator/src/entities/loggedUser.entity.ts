import { UserEntity } from "./user.entity";

export type LoggedUserEntity = {
  user: UserEntity;
  loggedUntil: number;
}

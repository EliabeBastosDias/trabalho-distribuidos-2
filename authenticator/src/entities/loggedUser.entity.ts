import { UserEntity } from "./user.entity";

export type LoggedUserEntity = {
  user: UserEntity;
  authToken?: string;
  loggedUntil?: number;
}

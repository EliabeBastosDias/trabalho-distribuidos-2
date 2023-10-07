import { LoggedUserEntity } from "../entities/loggedUser.entity";
import { UserEntity } from "../entities/user.entity";

export class UserRepository {
  private static instance: UserRepository;

  public static getInstance(
    users: UserEntity[],
    loggedUsers: LoggedUserEntity[]
  ): UserRepository {
    if (!UserRepository.instance) {
      const instance = new UserRepository(users, loggedUsers);
      UserRepository.instance = instance;
    }
    return UserRepository.instance;
  }

  private constructor(
    private users: UserEntity[],
    private loggedUsers: LoggedUserEntity[]
  ) {}

  public loginUser(login: string, password: string): boolean {
    const user = this.users.find((user) => user.login === login);
    if (!user) throw Error("User not found.");

    const isLogged = user.password === password;
    return isLogged;
  }

  public getLoggedUserByLogin(login: string): UserEntity {
    const loggedUser = this.loggedUsers.find(
      (loggedUser) => loggedUser.user.login === login
    );
    if (!loggedUser) throw Error("User not found.");

    return loggedUser.user;
  }

  public updateLoggedUntil(login: string, date: number): void {
    const user = this.loggedUsers.find(
      (loggedUser) => loggedUser.user.login === login
    );
    if (!user) throw Error("User not found.");

    user.loggedUntil = date;
  }

  public deleteLoggedUser(login: string): void {
    const index = this.loggedUsers.findIndex((user) => user.user.login === login);
    if (index === -1) console.log('Usuário não conectado');

    this.loggedUsers.splice(index, 1);
  }
}

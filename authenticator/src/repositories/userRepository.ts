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

  public loginUser(login: string, password: string): UserEntity | undefined {
    const user = this.users.find((user) => user.login === login);
    if (!user) throw Error("User not found.");

    const isLogged = user.password === password;

    if (isLogged) {
      this.loggedUsers.push({
        user,
        loggedUntil: new Date().getMilliseconds() + 10000,
      });
      return user;
    }
    return;
  }

  public getLoggedUserByLogin(login: string): UserEntity | undefined {
    const loggedUser = this.loggedUsers.find(
      (loggedUser) => loggedUser?.user.login === login
    );

    if (!loggedUser) return;
    if (loggedUser.loggedUntil < new Date().getMilliseconds()) return;

    return loggedUser.user;
  }

  public getLoggedUserByToken(token: string): UserEntity | undefined {
    const loggedUser = this.loggedUsers.find(
      (loggedUser) => loggedUser?.user.token === token
    );

    if (!loggedUser) return;

    return loggedUser.user;
  }

  public updateLoggedUntil(token: string): void {
    const user = this.loggedUsers.find(
      (loggedUser) => loggedUser.user.token === token
    );

    if (user) user.loggedUntil = new Date().getMilliseconds();
  }

  public deleteLoggedUser(login: string): void {
    const index = this.loggedUsers.findIndex(
      (user) => user.user.login === login
    );
    if (index === -1) console.log("Usuário não conectado");

    this.loggedUsers.splice(index, 1);
  }
}

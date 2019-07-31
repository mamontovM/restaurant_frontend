export class Users {
  id: number;
  login: string;
  password: string;
  name: string;
  surname: string;
  roleId: number;

  constructor(id: number, login: string, password: string, name: string, surname: string, roleId: number) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.name = name;
    this.surname = surname;
    this.roleId = roleId;
  }
}

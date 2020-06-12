import Client from "./client";

export interface LoginPayload {
  username: string;
  password: string;
}

export default class AuthClient extends Client {
  login(payload: LoginPayload) {
    const {
      username,
      password,
    } = payload;

    return this.post('/account/login/', {
      username,
      password,
      next: "/",
    });
  }
}

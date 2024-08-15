import { User } from "./user";

export type UserLoginResponse = {
  user: User;
  accessToken: string;
};

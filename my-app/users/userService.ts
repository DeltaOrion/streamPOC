import { axiosInstance } from "../axiosClient";
import { RegisterUserInput } from "./registerUserInput";
import { User } from "./user";
import { UserLoginInput } from "./userLoginInput";
import { UserLoginResponse } from "./userLoginResponse";

type UserServiceType = {
  login: (input: UserLoginInput) => Promise<UserLoginResponse>;
  register: (input: RegisterUserInput) => Promise<UserLoginResponse>;
  list: () => Promise<User[]>;
};

async function list() {
  return (await axiosInstance.get<User[]>("/user/list")).data;
}

async function login(input: UserLoginInput) {
  return (await axiosInstance.post<UserLoginResponse>(`/user/login`, input))
    .data;
}

async function register(input: RegisterUserInput) {
  const response = await axiosInstance.post<UserLoginResponse>(
    `/user/register`,
    input
  );
  return response.data;
}

export const userService: UserServiceType = {
  login: login,
  register: register,
  list: list,
};

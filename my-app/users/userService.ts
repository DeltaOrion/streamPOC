import axios from "axios";
import { axiosInstance } from "../axiosClient";
import { RegisterUserInput } from "./registerUserInput";
import { UserLoginInput } from "./userLoginInput";
import { UserLoginResponse } from "./userLoginResponse";

type UserServiceType = {
  login: (input: UserLoginInput) => Promise<UserLoginResponse>;
  register: (input: RegisterUserInput) => Promise<UserLoginResponse>;
};

async function login(input: UserLoginInput) {
  return (await axiosInstance.post<UserLoginResponse>(`/login`, input)).data;
}

async function register(input: RegisterUserInput) {
  try {
    const response = await axiosInstance.post<UserLoginResponse>(
      `/register`,
      input
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error: ", error.message);
      console.error("Response data: ", error.response?.data);
      console.error("Response status: ", error.response?.status);
      console.error("Headers: ", error.response?.headers);
      console.error("Request: ", error.request);
    } else {
      console.error("Unknown error: ", error);
    }
    throw error; // rethrow the error after logging it
  }
}

export const userService: UserServiceType = {
  login: login,
  register: register,
};

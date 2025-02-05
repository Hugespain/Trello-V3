import { User } from "./userinterface";

export interface LoginResponse {
  user: User;
  token: string;

}

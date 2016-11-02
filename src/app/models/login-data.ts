import { User } from "./user";

export class LoginData {
  success: boolean;
  token: string;
  user: User;
  expires: number;
}
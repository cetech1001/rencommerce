import { USER_ROLE } from "./auth.types";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: USER_ROLE;
}

export interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  role?: USER_ROLE;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: USER_ROLE;
  phone?: string | null;
  createdAt: Date;
}

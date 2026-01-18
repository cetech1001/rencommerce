export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: string;
}

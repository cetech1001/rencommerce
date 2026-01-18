export interface RegisterData {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

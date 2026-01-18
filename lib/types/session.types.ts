export interface SessionPayload {
  userID: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string;
}

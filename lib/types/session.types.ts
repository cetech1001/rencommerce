export interface SessionPayload {
  userID: string;
  email: string;
  name: string;
  role: string;
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

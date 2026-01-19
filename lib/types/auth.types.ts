export const USER_ROLE = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER'
} as const;
export type USER_ROLE = typeof USER_ROLE[keyof typeof USER_ROLE];

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

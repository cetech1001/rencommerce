/**
 * Authentication Types
 * Types related to user authentication and authorization
 */

/**
 * User data returned from authentication actions
 * Password is never included in this type
 */
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

/**
 * Login credentials
 */
export type LoginCredentials = {
  email: string;
  password: string;
};

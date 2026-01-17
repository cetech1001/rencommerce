/**
 * Session Types
 * Types related to user sessions and authentication
 */

/**
 * Session Payload
 * Data stored in the JWT token
 */
export interface SessionPayload {
  userID: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Session User
 * User data available in session
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

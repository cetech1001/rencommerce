/**
 * Common Types
 * Shared types used across the application
 */

/**
 * Generic Action Response Type
 * Used for all server actions to maintain consistency
 */
export type ActionResponse<T = null> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

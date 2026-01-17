export const clientConfig = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "EnergyHub",
  },
  auth: {
    sessionCookieName: "session",
  },
} as const;

export type ClientConfig = typeof clientConfig;

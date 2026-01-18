import { PrismaClient } from "./prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { config } from "./config";

const adapter = new PrismaMariaDb({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  connectionLimit: 5,
});

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (!config.isProduction) globalThis.prismaGlobal = prisma;

import { PrismaClient } from "@prisma/client";
import { D1Database } from "@cloudflare/workers-types";
import { DriverAdapter } from "@prisma/client/runtime/library";
import { PrismaD1 } from "@prisma/adapter-d1";

const getPrisma = (connection: D1Database): PrismaClient => {
  let adapter: DriverAdapter = new PrismaD1(connection);

  return new PrismaClient({ adapter });
};

export default getPrisma;

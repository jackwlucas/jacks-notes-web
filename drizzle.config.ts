import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  out: "./src/server/db/",
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;

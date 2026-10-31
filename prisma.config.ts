import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrations precisam de conexão direta. Na Vercel, a integração da Neon cria DATABASE_URL_UNPOOLED;
  // localmente só existe DATABASE_URL, que já é direta
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? env("DATABASE_URL"),
  },
});

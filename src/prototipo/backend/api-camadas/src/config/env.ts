export const env = {
  architecture: "camadas",
  port: Number(process.env.PORT ?? 3002),
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-trocar",
  databaseUrl: process.env.DATABASE_URL ?? "postgres://proto:proto@localhost:5434/camadas",
};

module.exports = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["./dist/db/entities/*.js"],
  logging: process.env.NODE_ENV !== "production",
  synchronize: process.env.NODE_ENV !== "production",
  migrations: ["./dist/db/migrations/*.js"],
  migrationsRun: true,
  cli: {
    entitiesDir: "./dist/db/entities",
    migrationsDir: "./dist/db/migrations",
  },
};

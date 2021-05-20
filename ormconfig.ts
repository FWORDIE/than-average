import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export default {
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: ["{src,dist}/db/entities/*{.ts,.js}"],
  logging: process.env.NODE_ENV !== "production",
  synchronize: process.env.NODE_ENV !== "production",
  migrations: ["{src,dist}/db/migrations/*{.ts,.js}"],
  migrationsRun: true,
  cli: {
    entitiesDir: "{src,dist}/db/entities",
    migrationsDir: "{src,dist}/db/migrations",
  },
} as PostgresConnectionOptions;

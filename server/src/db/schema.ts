import { InjectionToken } from "graphql-modules";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { integer } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	username: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull().unique(),
	supertokensId: varchar({ length: 255 }).notNull().unique(),
});

export const schema = {
	users,
} as const;

export type Database = NodePgDatabase<typeof schema>;

export const Db = new InjectionToken<Database>("db");

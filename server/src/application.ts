import { Db, schema as dbSchema } from "./db/schema";

import Stripe from "stripe";
import { schema as baseSchema } from "./schema/module";
import { createApplication as createGraphQLModulesApplication } from "graphql-modules";
import { drizzle } from "drizzle-orm/node-postgres";
import { subscription } from "./subscription/module";
import { user } from "./user/module";

export default function createApplication() {
	// This is your application, it contains your GraphQL schema and the implementation of it.
	const application = createGraphQLModulesApplication({
		modules: [baseSchema, user, subscription],
		providers: [
			{
				provide: Db,
				useFactory: () => drizzle({ schema: dbSchema, connection: process.env.DATABASE_URL! }),
			},
			{
				provide: Stripe,
				useFactory: () => new Stripe(process.env.STRIPE_API_KEY!),
			},
		],
	});

	const schema = application.schema;

	return [application, schema] as const;
}

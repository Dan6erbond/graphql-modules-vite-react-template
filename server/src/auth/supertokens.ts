import { schema, users } from "../db/schema";

import EmailPassword from "supertokens-node/recipe/emailpassword";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import Session from "supertokens-node/recipe/session";
import supertokens from "supertokens-node";

export function initSupertokens(db: NodePgDatabase<typeof schema>) {
	supertokens.init({
		framework: "hapi",
		supertokens: {
			// We use try.supertokens for demo purposes.
			// At the end of the tutorial we will show you how to create
			// your own SuperTokens core instance and then update your config.
			connectionURI: "https://try.supertokens.io",
			// apiKey: <YOUR_API_KEY>
		},
		appInfo: {
			// learn more about this on https://supertokens.com/docs/session/appinfo
			appName: "Customer Dashboard",
			apiDomain: "http://localhost:4000",
			websiteDomain: "http://localhost:5173",
			apiBasePath: "/auth",
			websiteBasePath: "/auth",
		},
		recipeList: [
			EmailPassword.init({
				override: {
					functions: (originalImplementation) => {
						return {
							...originalImplementation,
							signIn: async function (input) {
								const response = await originalImplementation.signIn(input);

								if (response.status === "OK") {
									await db.insert(users).values([
										{
											email: response.user.emails[0],
											supertokensId: response.user.id,
										},
									]);
								}

								return response;
							},
						};
					},
				},
			}), // initializes signin / sign up features
			Session.init(), // initializes session features
		],
	});
}

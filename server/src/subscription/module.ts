import { createModule } from "graphql-modules";
import { resolvers } from "./resolvers.generated";
import { typeDefs } from "./typeDefs.generated";

export const subscription = createModule({
	id: "subscription",
	typeDefs: [typeDefs],
	resolvers: resolvers,
});

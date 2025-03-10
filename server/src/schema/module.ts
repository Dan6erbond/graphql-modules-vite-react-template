import { createModule } from "graphql-modules";
import { resolvers } from "./resolvers.generated";
import { typeDefs } from "./typeDefs.generated";

export const schema = createModule({
	id: "schema",
	typeDefs: [typeDefs],
	resolvers,
});

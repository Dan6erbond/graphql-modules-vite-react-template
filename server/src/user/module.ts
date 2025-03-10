import { createModule } from "graphql-modules";
import { resolvers } from "./resolvers.generated";
import { typeDefs } from "./typeDefs.generated";

export const user = createModule({
	id: "user",
	typeDefs: [typeDefs],
	resolvers,
});

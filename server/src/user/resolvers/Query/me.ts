import { Db } from "../../../db/schema";
import { GraphQLError } from "graphql";
import type { QueryResolvers } from "./../../../schema/types.generated";

export const me: NonNullable<QueryResolvers["me"]> = async (_parent, _arg, ctx) => {
	if (!ctx.userId) {
		console.log("No session");
		throw new GraphQLError("Session not found");
	}

	const db = ctx.injector.get(Db);
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.supertokensId, ctx.userId!),
	});

	if (!user) {
		console.log("No user");
		throw new GraphQLError("Session not found");
	}

	return user;
};

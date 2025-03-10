import { Db } from "../../../db/schema";
import { GraphQLError } from "graphql";
import type { MutationResolvers } from "./../../../schema/types.generated";
import Stripe from "stripe";

export const subscribe: NonNullable<MutationResolvers["subscribe"]> = async (
	_parent,
	_arg,
	ctx,
) => {
	if (!ctx.userId) {
		console.log("No session");
		throw new GraphQLError("Session not found");
	}

	const db = ctx.injector.get(Db);
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.supertokensId, ctx.userId!),
	});

	const stripe = ctx.injector.get(Stripe);

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: process.env.STRIPE_PRICE_ID,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: `http://localhost:5173/?success=true`,
		cancel_url: `http://localhost:5173/?canceled=true`,
		customer_email: user?.email,
	});

	if (!session.url) {
		throw new GraphQLError("Failed to create payment session");
	}

	return session.url;
};

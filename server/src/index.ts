import "dotenv/config";
import "express-async-errors";
import "graphql-import-node";
import "reflect-metadata";
import "./auth/supertokens";

import Boom from "@hapi/boom";
import { Context } from "./context";
import { Db } from "./db/schema";
import { GraphQLError } from "graphql";
import Hapi from "@hapi/hapi";
import { Readable } from "node:stream";
import Session from "supertokens-node/recipe/session";
import Stripe from "stripe";
import createApplication from "./application";
import { createYoga } from "graphql-yoga";
import { initSupertokens } from "./auth/supertokens";
import { plugin } from "supertokens-node/framework/hapi";
import supertokens from "supertokens-node";
import { useGraphQLModules } from "@envelop/graphql-modules";

interface ServerContext {
	req: Hapi.Request;
	h: Hapi.ResponseToolkit;
}

process.on("SIGINT", () => {
	console.log("\nGracefully shutting down");
	process.exit(0);
});

export async function main() {
	try {
		console.log("🎉 Party time! Your app is ready to rock!\n");
		console.log("👉 Edit \x1b[38;5;208msrc/index.ts\x1b[0m and watch the magic happen here!");
		console.log("   Lets build something amazing!\n");

		const [application] = createApplication();

		const db = application.injector.get(Db);
		const stripe = application.injector.get(Stripe);

		initSupertokens(db);

		let server = Hapi.server({
			port: 4000,
			routes: {
				cors: {
					origin: ["http://localhost:5173"],
					additionalHeaders: [...supertokens.getAllCORSHeaders()],
					credentials: true,
				},
			},
		});

		const yoga = createYoga<ServerContext, Context>({
			plugins: [useGraphQLModules(application)],
			context: async ({ req, h }) => {
				try {
					const session = await Session.getSession(req, h, {
						sessionRequired: false,
					});

					return {
						userId: session !== undefined ? session.getUserId() : undefined,
					} as Context;
				} catch (err) {
					if (Session.Error.isErrorFromSuperTokens(err)) {
						throw new GraphQLError("Session related error", {
							extensions: {
								code: "UNAUTHENTICATED",
								http: { status: err.type === Session.Error.INVALID_CLAIMS ? 403 : 401 },
							},
						});
					}

					throw err;
				}
			},
		});

		server.route({
			method: "*",
			path: yoga.graphqlEndpoint,
			options: {
				payload: {
					// let yoga handle the parsing
					output: "stream",
				},
			},
			handler: async (req, h) => {
				const { status, headers, body } = await yoga.handleNodeRequestAndResponse(
					req.raw.req,
					req.raw.res,
					{
						req,
						h,
					},
				);

				const res = h.response(
					Readable.from(body!, {
						// hapi needs the stream not to be in object mode
						objectMode: false,
					}),
				);

				for (const [key, val] of headers) {
					res.header(key, val);
				}

				return res.code(status);
			},
		});

		server.route({
			method: "POST",
			path: "/stripe-webhook",
			handler: async (req, h) => {
				const sig = req.headers["stripe-signature"];

				let event;

				try {
					event = stripe.webhooks.constructEvent(
						req.payload as string | Buffer<ArrayBufferLike>,
						sig as string,
						process.env.STRIPE_WEBHOOK_SECRET!,
					);
				} catch (err: any) {
					throw Boom.badRequest("Webhook error: " + err.message);
				}

				if (
					event.type === "checkout.session.completed" ||
					event.type === "checkout.session.async_payment_succeeded"
				) {
					console.log("Fulfilling Checkout Session " + event.data.object.id);

					// TODO: Make this function safe to run multiple times,
					// even concurrently, with the same session ID

					// TODO: Make sure fulfillment hasn't already been
					// peformed for this Checkout Session

					// Retrieve the Checkout Session from the API with line_items expanded
					const checkoutSession = await stripe.checkout.sessions.retrieve(event.data.object.id, {
						expand: ["line_items"],
					});

					// Check the Checkout Session's payment_status property
					// to determine if fulfillment should be peformed
					if (checkoutSession.payment_status !== "unpaid") {
						// TODO: Perform fulfillment of the line items
						// TODO: Record/save fulfillment status for this
						// Checkout Session
					}
				}

				return "";
			},
		});

		await server.register(plugin);

		await server.start();
	} catch (error) {
		console.error("Failed to start:", error);
		process.exit(1);
	}
}

main();

import { Injector } from "graphql-modules";
import { SessionRequest } from "supertokens-node/framework/express";
import { YogaInitialContext } from "graphql-yoga";

export interface Context extends YogaInitialContext {
	request: Request & SessionRequest;
	userId?: string;
	injector: Injector;
}

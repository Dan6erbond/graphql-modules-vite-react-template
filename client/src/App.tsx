import * as reactRouter from "react-router";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BrowserRouter, useRoutes } from "react-router";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";

import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { HeroUIProvider } from "@heroui/react";
import Session from "supertokens-auth-react/recipe/session";
import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { routes } from "./routes";

const client = new ApolloClient({
	uri: "http://localhost:4000/graphql",
	cache: new InMemoryCache(),
});

SuperTokens.init({
	appInfo: {
		// learn more about this on https://supertokens.com/docs/references/app-info
		appName: "Customer Dashboard",
		apiDomain: "http://localhost:4000",
		websiteDomain: "http://localhost:5173",
		apiBasePath: "/auth",
		websiteBasePath: "/auth",
	},
	recipeList: [EmailPassword.init(), Session.init()],
});

function Routes() {
	const authRoutes = getSuperTokensRoutesForReactRouterDom(reactRouter, [
		EmailPasswordPreBuiltUI,
	]);

	const appRoutes = useRoutes([
		...authRoutes.map((route) => route.props),
		...routes,
	]);

	return appRoutes;
}

function App() {
	return (
		<SuperTokensWrapper>
			<BrowserRouter>
				<ApolloProvider client={client}>
					<HeroUIProvider>
						<Routes />
					</HeroUIProvider>
				</ApolloProvider>
			</BrowserRouter>
		</SuperTokensWrapper>
	);
}

export default App;

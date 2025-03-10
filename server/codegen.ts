import type { CodegenConfig } from "@graphql-codegen/cli";
import { defineConfig } from "@eddeee888/gcg-typescript-resolver-files";

const config: CodegenConfig = {
	schema: "./src/**/*.graphql",
	documents: "src/**/*.spec.ts",
	ignoreNoDocuments: true,
	hooks: {
		afterAllFileWrite: ["prettier --write"],
	},
	generates: {
		"src/schema": defineConfig({
			resolverMainFileMode: "modules", // generates resolvers map based on each .graphqls file, for createModule
			typeDefsFileMode: "modules", // generates typeDefs based on each .graphqls file, for createModule
			resolverGeneration: "minimal",
			typesPluginsConfig: {
				contextType: "../context#Context",
			},
		}),
	},
};
export default config;

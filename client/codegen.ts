import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: "http://localhost:4000/graphql",
	documents: ["src/**/*.tsx"],
	config: {
		nonOptionalTypename: true,
	},
	ignoreNoDocuments: true, // for better experience with the watcher
	generates: {
		"./src/gql/": {
			preset: "client",
			config: {
				useTypeImports: true,
			},
		},
	},
};

export default config;

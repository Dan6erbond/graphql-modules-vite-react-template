import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import ts from "typescript-eslint";
import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));
const prettierConfig = JSON.parse(readFileSync(new URL("./.prettierrc", import.meta.url)));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},
		},
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			"prettier/prettier": ["error", prettierConfig],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		},
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: ts.parser,
		},
	},
);

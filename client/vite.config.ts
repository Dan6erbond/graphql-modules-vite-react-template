import autoprefixer from "autoprefixer";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	css: {
		postcss: {
			plugins: [tailwind, autoprefixer],
		},
	},
});

import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss/types/config";

export default {
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	darkMode: "class",
	plugins: [heroui()],
} satisfies Config;

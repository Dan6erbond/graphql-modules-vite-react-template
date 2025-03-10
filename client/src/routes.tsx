import Home from "./pages";
import Layout from "./layout";
import { RouteObject } from "react-router";

export const routes: RouteObject[] = [
	{
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
		],
	},
];

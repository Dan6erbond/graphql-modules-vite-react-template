import { FragmentType, graphql, useFragment } from "@/gql";
import { useMutation, useQuery } from "@apollo/client";

import { Button } from "@heroui/react";
import { SessionAuth } from "supertokens-auth-react/recipe/session";
import { signOut } from "supertokens-web-js/recipe/session";
import { useNavigate } from "react-router";

export const UserProfileFragment = graphql(`
	fragment UserProfile on User {
		id
		email
		username
	}
`);

export const getMe = graphql(`
	query GetMe {
		me {
			id
			...UserProfile
		}
	}
`);

export const subscribe = graphql(`
	mutation Subscribe {
		subscribe
	}
`);

function Profile({ me }: { me: FragmentType<typeof UserProfileFragment> }) {
	const data = useFragment(UserProfileFragment, me);

	return <div>{data.email}</div>;
}

export default function Home() {
	const navigate = useNavigate();

	const { data } = useQuery(getMe);

	const [mutate] = useMutation(subscribe);

	return (
		<SessionAuth>
			<div>
				<Button
					onPress={async () => {
						await signOut();
						navigate("/auth");
					}}
				>
					Sign Out
				</Button>
				{data?.me && <Profile me={data.me} />}
				<Button
					onPress={async () => {
						const { data } = await mutate();

						if (!data?.subscribe) return;

						window.location.href = data.subscribe;
					}}
				>
					Subscribe
				</Button>
			</div>
		</SessionAuth>
	);
}

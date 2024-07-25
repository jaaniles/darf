import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LobbyPage from "~/lobby/LobbyPage/LobbyPage";
import { getSession, getTokenUser } from "~/session.server";
import { BaseLayout } from "~/ui/Layout/BaseLayout";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { lobbyId } = params;

  if (!lobbyId) {
    redirect("/");
    return;
  }

  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);

  if (!session || !tokenUser) {
    return redirect("/login");
  }

  return {
    lobbyId,
    userId: tokenUser.uid,
  };
};

export default function LobbyPageRoute() {
  const { lobbyId, userId } = useLoaderData<typeof loader>();

  const user = {
    userId,
  };

  return (
    <BaseLayout user={user}>
      <LobbyPage lobbyId={lobbyId} userId={userId} />
    </BaseLayout>
  );
}

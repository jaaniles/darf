import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DecodedIdToken } from "firebase-admin/auth";
import LobbyPage from "~/lobby/LobbyPage/LobbyPage";
import { requireUserSession } from "~/session.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { lobbyId } = params;

  if (!lobbyId) {
    redirect("/");
    return;
  }

  const session = (await requireUserSession(request)) as DecodedIdToken;

  return {
    lobbyId,
    userId: session.uid,
  };
};

export default function LobbyPageRoute() {
  const { lobbyId, userId } = useLoaderData<typeof loader>();

  return <LobbyPage lobbyId={lobbyId} userId={userId} />;
}

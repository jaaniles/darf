import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DecodedIdToken } from "firebase-admin/auth";
import GamePage from "~/game/GamePage/GamePage";
import { requireUserSession } from "~/session.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { gameId } = params;

  if (!gameId) {
    redirect("/");
    return;
  }

  const session = (await requireUserSession(request)) as DecodedIdToken;

  return {
    gameId,
    userId: session.uid,
  };
};

export default function GameRoute() {
  const { gameId, userId } = useLoaderData<typeof loader>();

  return <GamePage gameId={gameId} userId={userId} />;
}

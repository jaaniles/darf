import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DecodedIdToken } from "firebase-admin/auth";
import GameOverPage from "~/game/GameOverPage/GameOverPage";
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

export default function GameOverRoute() {
  const { gameId, userId } = useLoaderData<typeof loader>();

  return <GameOverPage gameId={gameId} userId={userId} />;
}

import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import GamePage from "~/game/GamePage/GamePage";
import { getSession, getTokenUser } from "~/session.server";
import { BaseLayout } from "~/ui/Layout/BaseLayout";

export const loader: LoaderFunction = async ({ params, request }) => {
  const { gameId } = params;

  if (!gameId) {
    return redirect("/");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);

  if (!session || !tokenUser) {
    return redirect("/login");
  }

  return {
    gameId,
    userId: tokenUser.uid,
  };
};

export default function GameRoute() {
  const { gameId, userId } = useLoaderData<typeof loader>();

  const user = {
    userId,
  };

  return (
    <BaseLayout user={user}>
      <GamePage gameId={gameId} userId={userId} />
    </BaseLayout>
  );
}

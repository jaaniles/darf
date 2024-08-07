import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserProfile } from "~/auth/getUserProfile";
import GameOverPage from "~/game/GameOverPage/GameOverPage";
import { getSession, getTokenUser } from "~/session.server";
import { BaseLayout } from "~/ui/Layout/BaseLayout";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);
  const user = await getUserProfile(tokenUser);

  if (!user?.displayName) {
    return redirect("/profile");
  }

  return json({ user, gameId: params.gameId });
};

export default function GameOverRoute() {
  const { gameId, user } = useLoaderData<typeof loader>();

  return (
    <BaseLayout>
      <GameOverPage gameId={gameId} user={user} />
    </BaseLayout>
  );
}

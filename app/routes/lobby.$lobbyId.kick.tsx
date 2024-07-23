import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { kickFromLobby } from "~/lobby/kickFromLobby.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { lobbyId } = params;

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const userToKick = formData.get("userToKick") as string;

  if (!userId || !lobbyId || !userToKick) {
    return redirect("/");
  }

  const response = await kickFromLobby({ userId, userToKick, lobbyId });

  if (!response) {
    console.error("Failed to kick from lobby");
    return redirect("/");
  }

  return redirect(`/lobby/${lobbyId}`);
};

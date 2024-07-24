import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { joinLobby } from "~/lobby/joinLobby.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const joinCode = formData.get("joinCode") as string;
  const userId = formData.get("userId") as string;
  const displayName = formData.get("displayName") as string;

  if (!joinCode) {
    return redirect("/");
  }

  const response = await joinLobby({ joinCode, userId, displayName });

  if (!response) {
    console.error("Failed to join lobby");
    return redirect("/");
  }

  return redirect(`/lobby/${response.lobbyId}`);
};

import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createLobby } from "~/lobby/createLobby.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const displayName = formData.get("displayName") as string;

  if (!userId || !displayName) {
    return redirect("/");
  }

  const response = await createLobby({ userId, displayName });

  if (!response) {
    console.error("Failed to create lobby");
    return redirect("/");
  }

  return redirect(`/lobby/${response.lobbyId}`);
};

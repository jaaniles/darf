import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createLobby } from "~/lobby/createLobby.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;

  if (!userId) {
    return redirect("/");
  }

  const response = await createLobby({ userId });

  if (!response) {
    console.error("Failed to create lobby");
    return redirect("/");
  }

  return redirect(`/lobby/${response.lobbyId}`);
};

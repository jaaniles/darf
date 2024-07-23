import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { lobbyPlayerReady } from "~/lobby/lobbyPlayerReady.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { lobbyId } = params;

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const ready = formData.get("ready") as "true" | "false";

  if (!userId || !lobbyId || !ready) {
    return redirect("/");
  }

  const response = await lobbyPlayerReady({
    userId,
    lobbyId,
    ready: ready === "true",
  });

  if (!response) {
    console.error("Failed to kick from lobby");
    return redirect("/");
  }

  return redirect(`/lobby/${lobbyId}`);
};

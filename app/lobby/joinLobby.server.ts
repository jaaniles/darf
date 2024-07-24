import { joinLobbyRequest } from "~/lobby/joinLobbyRequest.server";

type Input = {
  userId: string;
  joinCode: string;
  displayName: string;
};

type Output = {
  lobbyId: string;
  userId: string;
} | null;

export async function joinLobby(input: Input): Promise<Output> {
  const response = await joinLobbyRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    lobbyId: response.value.data.lobbyId,
    userId: response.value.data.userId,
  };
}

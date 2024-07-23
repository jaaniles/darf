import { exitLobbyRequest } from "~/lobby/exitLobbyRequest.server";

type Input = {
  lobbyId: string;
  userId: string;
};

type Output = {
  lobbyId: string;
  userId: string;
} | null;

export async function exitLobby(input: Input): Promise<Output> {
  const response = await exitLobbyRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    lobbyId: response.value.data.lobbyId,
    userId: response.value.data.userId,
  };
}

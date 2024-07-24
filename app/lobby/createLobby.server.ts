import { createLobbyRequest } from "~/lobby/createLobbyRequest.server";

type Input = {
  userId: string;
  displayName: string;
};

type Output = {
  lobbyId: string;
  joinCode: string;
} | null;

export async function createLobby(input: Input): Promise<Output> {
  const response = await createLobbyRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    lobbyId: response.value.data.lobbyId,
    joinCode: response.value.data.joinCode,
  };
}

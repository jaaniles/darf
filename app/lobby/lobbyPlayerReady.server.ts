import { lobbyPlayerReadyRequest } from "~/lobby/lobbyPlayerReadyRequest.server";

type Input = {
  userId: string;
  lobbyId: string;
  ready?: boolean;
};

type Output = {
  lobbyId: string;
  userId: string;
} | null;

export async function lobbyPlayerReady(input: Input): Promise<Output> {
  const response = await lobbyPlayerReadyRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    lobbyId: response.value.data.lobbyId,
    userId: response.value.data.userId,
  };
}

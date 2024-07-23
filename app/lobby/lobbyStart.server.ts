import { lobbyStartRequest } from "~/lobby/lobbyStartRequest.server";

type Input = {
  userId: string;
  lobbyId: string;
};

type Output = {
  gameId: string;
  roundId: string;
} | null;

export async function lobbyStart(input: Input): Promise<Output> {
  const response = await lobbyStartRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    gameId: response.value.data.gameId,
    roundId: response.value.data.roundId,
  };
}

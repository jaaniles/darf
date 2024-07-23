import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  userId: string;
  lobbyId: string;
};

const LobbyStartResponse = z.object({
  data: z.object({
    gameId: z.string(),
    roundId: z.string(),
  }),
});

type LobbyStartResponse = z.infer<typeof LobbyStartResponse>;

export async function lobbyStartRequest(
  input: Input
): Promise<Try<LobbyStartResponse>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(`/startGameFromLobby`, {
      lobbyId: input.lobbyId,
      user: input.userId,
    });

    return unwrap(await validateResponse(response, LobbyStartResponse));
  });
}

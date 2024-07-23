import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  userId: string;
  lobbyId: string;
  ready?: boolean;
};

const LobbyPlayerReadyResponse = z.object({
  data: z.object({
    lobbyId: z.string(),
    userId: z.string(),
  }),
});

type LobbyPlayerReadyResponse = z.infer<typeof LobbyPlayerReadyResponse>;

export async function lobbyPlayerReadyRequest(
  input: Input
): Promise<Try<LobbyPlayerReadyResponse>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(
      `/lobbyPlayerReady?ready=${input.ready ? "cancel" : "ready"}`,
      {
        lobbyId: input.lobbyId,
        userId: input.userId,
      }
    );

    return unwrap(await validateResponse(response, LobbyPlayerReadyResponse));
  });
}

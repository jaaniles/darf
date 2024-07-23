import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  lobbyId: string;
  userId: string;
};

const ExitLobbyResponse = z.object({
  data: z.object({
    lobbyId: z.string(),
    userId: z.string(),
  }),
});

type ExitLobbyResponse = z.infer<typeof ExitLobbyResponse>;

export async function exitLobbyRequest(
  input: Input
): Promise<Try<ExitLobbyResponse>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(`/exitLobby`, {
      lobbyId: input.lobbyId,
      userId: input.userId,
    });

    return unwrap(await validateResponse(response, ExitLobbyResponse));
  });
}

import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  userId: string;
  joinCode: string;
  displayName: string;
};

const JoinLobbyResponse = z.object({
  data: z.object({
    lobbyId: z.string(),
    userId: z.string(),
  }),
});

type JoinLobbyResponseType = z.infer<typeof JoinLobbyResponse>;

export async function joinLobbyRequest(
  input: Input
): Promise<Try<JoinLobbyResponseType>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(`/joinLobby`, {
      joinCode: input.joinCode,
      displayName: input.displayName,
      userId: input.userId,
    });

    return unwrap(await validateResponse(response, JoinLobbyResponse));
  });
}

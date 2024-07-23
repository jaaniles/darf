import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  lobbyId: string;
  userId: string;
  userToKick: string;
};

const KickFromLobbyResponse = z.object({
  data: z.object({
    lobbyId: z.string(),
    userToKick: z.string(),
  }),
});

type KickFromLobbyResponse = z.infer<typeof KickFromLobbyResponse>;

export async function kickFromLobbyRequest(
  input: Input
): Promise<Try<KickFromLobbyResponse>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(`/kickFromLobby`, {
      lobbyId: input.lobbyId,
      userId: input.userId,
      userToKick: input.userToKick,
    });

    return unwrap(await validateResponse(response, KickFromLobbyResponse));
  });
}

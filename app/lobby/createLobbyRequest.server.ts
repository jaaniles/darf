import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  userId: string;
};

const CreateLobbyResponse = z.object({
  data: z.object({
    lobbyId: z.string(),
    joinCode: z.string(),
  }),
});

type CreateLobbyResponseType = z.infer<typeof CreateLobbyResponse>;

export async function createLobbyRequest(
  input: Input
): Promise<Try<CreateLobbyResponseType>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(`/createLobby`, {
      userId: input.userId,
    });

    return unwrap(await validateResponse(response, CreateLobbyResponse));
  });
}

import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  roundId: string;
  userId: string;
  action: "continue" | "exit";
};

const PlayerActionResponse = z.object({
  data: z.object({
    roundId: z.string(),
    userId: z.string(),
  }),
});

type PlayerActionResponse = z.infer<typeof PlayerActionResponse>;

export async function playerActionRequest(
  input: Input
): Promise<Try<PlayerActionResponse>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(
      `/playerAction?action=${input.action}`,
      {
        roundId: input.roundId,
        user: input.userId,
      }
    );

    console.log("playerActionRequest response", response);

    return unwrap(await validateResponse(response, PlayerActionResponse));
  });
}

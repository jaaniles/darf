import { z } from "zod";
import { jsonPostRequest, validateResponse } from "~/request.server";
import { Try, unwrap, withTry } from "~/try.server";

type Input = {
  roundId: string;
  userId: string;
};

const NextTurnResponse = z.object({
  data: z.object({
    roundId: z.string(),
    message: z.optional(z.string()),
    error: z.optional(z.boolean()),
  }),
});

type NextTurnResponse = z.infer<typeof NextTurnResponse>;

export async function nextTurnRequest(
  input: Input
): Promise<Try<NextTurnResponse>> {
  return await withTry(async () => {
    const response = await jsonPostRequest(`/nextTurn`, {
      roundId: input.roundId,
      user: input.userId,
    });

    return unwrap(await validateResponse(response, NextTurnResponse));
  });
}

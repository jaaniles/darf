import { nextTurnRequest } from "~/game/nextTurnRequest.server";

type Input = {
  roundId: string;
  userId: string;
};

type Output = {
  roundId: string;
  message?: string;
  error?: boolean;
} | null;

export async function nextTurn(input: Input): Promise<Output> {
  const response = await nextTurnRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    roundId: response.value.data.roundId,
    message: response.value.data.message,
  };
}

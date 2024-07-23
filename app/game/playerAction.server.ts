import { playerActionRequest } from "~/game/playerActionRequest.server";

type Input = {
  roundId: string;
  userId: string;
  action: "continue" | "exit";
};

type Output = {
  roundId: string;
  userId: string;
} | null;

export async function playerAction(input: Input): Promise<Output> {
  const response = await playerActionRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    roundId: response.value.data.roundId,
    userId: response.value.data.userId,
  };
}

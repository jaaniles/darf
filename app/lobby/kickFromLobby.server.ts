import { kickFromLobbyRequest } from "~/lobby/kickFromLobbyRequest.server";

type Input = {
  lobbyId: string;
  userId: string;
  userToKick: string;
};

type Output = {
  lobbyId: string;
  userToKick: string;
} | null;

export async function kickFromLobby(input: Input): Promise<Output> {
  const response = await kickFromLobbyRequest(input);

  if (!response.success) {
    return null;
  }

  return {
    lobbyId: response.value.data.lobbyId,
    userToKick: response.value.data.userToKick,
  };
}

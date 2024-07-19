import type { MetaFunction } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { db } from "~/firebase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const action = async () => {
  const lobbyRef = db.collection("lobbies").doc();
  await lobbyRef.create({});
  const lobbyId = lobbyRef.id;

  const playerRef = db.collection("players").doc();
  await playerRef.create({
    lobby: lobbyId,
    timestamp: new Date(),
  });

  await lobbyRef.set({
    admin: playerRef.id,
    players: [playerRef.id],
  });

  return redirect(`/play/${lobbyId}`);
};

export default function Lobby() {
  return (
    <div className="font-sans p-4">
      <Form method="post" action="/lobby">
        <p>MOII!</p>
        <input type="text" />
        <button type="submit">Create lobby</button>
      </Form>
    </div>
  );
}

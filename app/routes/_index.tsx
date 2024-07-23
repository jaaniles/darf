import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, json, Link, useLoaderData } from "@remix-run/react";
import { DecodedIdToken } from "firebase-admin/auth";
import { requireUserSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Darf" },
    { name: "description", content: "A great game for game enthusiasts" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = (await requireUserSession(request)) as DecodedIdToken;

  return json({
    uid: session.uid,
  });
};

export default function Index() {
  const { uid } = useLoaderData<typeof loader>();

  return (
    <div className="font-sans p-4">
      <Link to="/logout">Logout</Link>
      <h1>Create</h1>
      <Form method="post" action="/lobby/create">
        <input type="hidden" value={uid} name="userId" />
        <button type="submit">Create lobby</button>
      </Form>

      <hr />

      <h1>Join</h1>
      <Form method="post" action="/lobby/join">
        <input type="hidden" value={uid} name="userId" />
        <input type="text" name="joinCode" />
        <button type="submit">Join lobby</button>
      </Form>
    </div>
  );
}

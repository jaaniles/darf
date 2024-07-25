import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserProfile } from "~/auth/getUserProfile";
import { lore } from "~/routes/library";
import { getSession, getTokenUser } from "~/session.server";

import { BaseLayout } from "~/ui/Layout/BaseLayout";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);
  const user = await getUserProfile(tokenUser);

  const { topic } = params;

  if (!topic) {
    return redirect("/");
  }

  return json({ topic, user });
};

export default function LoreRoute() {
  const { topic, user } = useLoaderData<typeof loader>();

  const Component = lore[topic];

  return <BaseLayout user={user}>{Component}</BaseLayout>;
}

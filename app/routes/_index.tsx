import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";

import { getUserProfile } from "~/auth/getUserProfile";
import { MainMenu } from "~/main/MainMenu/MainMenu";
import { commitSession, getSession, getTokenUser } from "~/session.server";

import { BaseLayout } from "~/ui/Layout/BaseLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "Darf" },
    { name: "description", content: "A great game for game enthusiasts" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);
  const user = await getUserProfile(tokenUser);

  if (!session || !tokenUser) {
    return redirect("/login");
  }

  if (!user?.displayName) {
    const session = await getSession(request.headers.get("Cookie"));
    session.flash(
      "error",
      "Missing Expedition profile. Please provide required information below."
    );
    return redirect("/profile", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return json({ user });
};

export default function IndexRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <BaseLayout user={user}>
      <MainMenu user={user} />
    </BaseLayout>
  );
}

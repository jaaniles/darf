import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { getUserProfile } from "~/auth/getUserProfile.server";
import { MainMenu } from "~/main/MainMenu/MainMenu";

import { BaseLayout } from "~/ui/Layout/BaseLayout";

export type FirebaseUser = {
  uid: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Darf" },
    { name: "description", content: "A great game for game enthusiasts" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserProfile(request);

  if (!user?.displayName) {
    return redirect("/profile");
  }

  return json({ user });
};

export default function IndexRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <BaseLayout>
      <MainMenu user={user} />
    </BaseLayout>
  );
}

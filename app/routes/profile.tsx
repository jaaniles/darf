import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserProfile } from "~/auth/getUserProfile";
import { db } from "~/firebase.server";
import { EditProfile } from "~/profile/EditProfile/EditProfile";
import { commitSession, getSession, getTokenUser } from "~/session.server";
import { Callout } from "~/ui/Callout/Callout";
import { BaseLayout } from "~/ui/Layout/BaseLayout";
import { Stack } from "~/ui/Stack/Stack";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const displayName = formData.get("displayName") as string;

  if (!userId || !displayName) {
    return redirect("/profile");
  }

  const response = await db.collection("user").doc(userId).set({
    displayName,
  });

  console.log("moro moro", response, userId, displayName);

  if (!response) {
    console.error("Failed to update user profile");
    return redirect("/profile");
  }

  return redirect("/");
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);
  const user = await getUserProfile(tokenUser);

  if (!session || !tokenUser) {
    return redirect("/login");
  }

  const message = session.get("error") || null;

  return json(
    { user, message },
    { headers: { "Set-Cookie": await commitSession(session) } }
  );
};

export default function ProfileRoute() {
  const { user, message } = useLoaderData<typeof loader>();

  return (
    <BaseLayout user={user}>
      <Stack spacing={32}>
        {message && <Callout text={message} variant="error" />}
        <EditProfile user={user} />
      </Stack>
    </BaseLayout>
  );
}

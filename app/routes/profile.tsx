import {
  ActionFunctionArgs,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserProfile } from "~/auth/getUserProfile.server";
import { db } from "~/firebase.server";
import { EditProfile } from "~/profile/EditProfile/EditProfile";
import { BaseLayout } from "~/ui/Layout/BaseLayout";

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

  return redirect("/profile");
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserProfile(request);

  return json({ user });
};

export default function ProfileRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <BaseLayout>
      <EditProfile user={user} />
    </BaseLayout>
  );
}

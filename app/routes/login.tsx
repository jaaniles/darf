import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LoginPage from "~/auth/LoginPage/LoginPage";
import { createUserSession, getUserSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString();

  if (!idToken) {
    return null;
  }

  return createUserSession(idToken, "/");
};

export const loader: LoaderFunction = async ({ request }) => {
  const userSession = await getUserSession(request);

  return json({
    loggedIn: !!userSession,
  });
};

export default function LoginRoute() {
  const { loggedIn } = useLoaderData<{ loggedIn: boolean }>();

  return (
    <>
      {loggedIn && <div>Logged in</div>}
      <LoginPage />
    </>
  );
}

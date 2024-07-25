import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import LoginPage from "~/auth/LoginPage/LoginPage";
import { createUserSession, getSession, getTokenUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const idToken = form.get("idToken")?.toString();

  if (!idToken) {
    return null;
  }

  return createUserSession(idToken, "/");
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);

  const loggedIn = !!tokenUser;

  if (loggedIn) {
    return redirect("/");
  }

  return null;
};

export default function LoginRoute() {
  return <LoginPage />;
}

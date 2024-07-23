import { LoaderFunction } from "@remix-run/node";

import { signOut } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  return await signOut(request);
};

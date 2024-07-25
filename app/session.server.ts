import {
  createCookieSessionStorage,
  createCookie,
  redirect,
  Session,
  SessionData,
} from "@remix-run/node";

import { db, auth as serverAuth, SESSION_EXPIRY } from "~/firebase.server";

const cookieSecret = process.env.cookieSecret || "";

export const session = createCookie("session", {
  secrets: [cookieSecret],
  path: "/",
});

export const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [cookieSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export async function requireUserSession(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");

  if (!token) {
    throw redirect("/login");
  }

  try {
    const tokenUser = await serverAuth.verifySessionCookie(token, true);

    if (!tokenUser) {
      throw redirect("/login");
    }

    return tokenUser;
  } catch (error) {
    return redirect("/login");
  }
}

export async function requireUserProfile(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");

  if (!token) {
    throw redirect("/login");
  }

  const tokenUser = await serverAuth.verifySessionCookie(token, true);

  if (!tokenUser) {
    throw redirect("/login");
  }

  const userSnapshot = await db.collection("user").doc(tokenUser.uid).get();

  if (!userSnapshot.exists) {
    throw redirect("/profile");
  }

  return tokenUser;
}

export async function getTokenUser(session: Session<SessionData, SessionData>) {
  const token = session.get("token");

  if (!token) {
    return null;
  }

  try {
    const tokenUser = await serverAuth.verifySessionCookie(token, true);

    return tokenUser;
  } catch (error) {
    return null;
  }
}

export async function createUserSession(idToken: string, redirectTo: string) {
  const token = await getSessionToken(idToken);
  const session = await storage.getSession();
  session.set("token", token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session, {
        expires: new Date(Date.now() + SESSION_EXPIRY),
      }),
    },
  });
}

async function getSessionToken(idToken: string) {
  const decodedToken = await serverAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }

  return serverAuth.createSessionCookie(idToken, { expiresIn: SESSION_EXPIRY });
}

export async function destroySession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const newCookie = await storage.destroySession(session);

  return redirect("/login", { headers: { "Set-Cookie": newCookie } });
}

export async function signOut(request: Request) {
  return await destroySession(request);
}

const { getSession, commitSession } = storage;

export { getSession, commitSession };

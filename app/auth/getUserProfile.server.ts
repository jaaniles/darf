import { DecodedIdToken } from "firebase-admin/auth";
import { db } from "~/firebase.server";
import { requireUserSession } from "~/session.server";

export type UserProfile = {
  uid: string;
  displayName?: string;
};

export const getUserProfile = async (request: Request) => {
  const session = (await requireUserSession(request)) as DecodedIdToken;

  if (!session || !session.uid) {
    return null;
  }

  const userSnapshot = await db.collection("user").doc(session?.uid).get();

  if (!userSnapshot.exists) {
    return {
      uid: session.uid,
    };
  }

  const data = userSnapshot.data();

  return {
    uid: session.uid,
    displayName: data?.displayName,
  };
};

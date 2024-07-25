import { DecodedIdToken } from "firebase-admin/auth";
import { db } from "~/firebase.server";

export type UserProfile = {
  userId: string;
  displayName?: string;
};

export const getUserProfile = async (tokenUser: DecodedIdToken | null) => {
  if (!tokenUser || !tokenUser.uid) {
    return null;
  }

  const userSnapshot = await db.collection("user").doc(tokenUser?.uid).get();

  if (!userSnapshot.exists) {
    return {
      userId: tokenUser.uid,
    };
  }

  const data = userSnapshot.data();

  return {
    userId: tokenUser.uid,
    displayName: data?.displayName,
  };
};

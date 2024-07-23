import { useFetcher } from "@remix-run/react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "~/firebase.client";

export default function LoginPage() {
  const fetcher = useFetcher();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, new GoogleAuthProvider()).then(onProviderSignIn);
  };

  async function onProviderSignIn(credential: UserCredential) {
    const idToken = await credential.user.getIdToken();
    fetcher.submit({ idToken }, { method: "post", action: "/login" });
  }

  return (
    <div>
      <p>Login page</p>

      <button onClick={handleGoogleLogin} type="button">
        Login with Google
      </button>
    </div>
  );
}

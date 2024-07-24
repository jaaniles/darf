import { useFetcher } from "@remix-run/react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

import { auth } from "~/firebase.client";
import { Button } from "~/ui/Button/Button";
import { LoginLayout } from "~/ui/Layout/LoginLayout";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";

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
    <LoginLayout>
      <Stack spacing={16}>
        <Headline as="h2" size="sm" color="primary" weight="bold">
          The Expedition needs you!
        </Headline>
        <Button
          onClick={handleGoogleLogin}
          type="button"
          text="Login with Google"
          full
        />
      </Stack>
    </LoginLayout>
  );
}

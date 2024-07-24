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
import { LoreText } from "~/ui/typography/LoreText";
import { Text } from "~/ui/typography/Text";

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
        <Headline
          as="h2"
          size="sm"
          color="primary"
          weight="bold"
          align="center"
        >
          The <LoreText content={<ExpeditionLore />}>Expedition</LoreText> needs
          you!
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

const ExpeditionLore = () => (
  <div>
    <Text>
      {`A Dwarven digging company called 'Expedition' is the most influential company in the kingdom.\n\nThey have been digging for centuries and have found many treasures.\n\nThey are now looking for new recruits to join their ranks and help them find even more treasures. Will you join them on their quest?`}
    </Text>
  </div>
);

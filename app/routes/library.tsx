import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserProfile } from "~/auth/getUserProfile";
import { ExpeditionLore } from "~/lore/ExpeditionLore";
import { SecretPhraseLore } from "~/lore/SecretPhraseLore";
import { getSession, getTokenUser } from "~/session.server";
import { BaseLayout } from "~/ui/Layout/BaseLayout";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";
import { LoreText } from "~/ui/typography/LoreText";
import { Text } from "~/ui/typography/Text";

export const lore: { [key: string]: JSX.Element } = {
  expedition: <ExpeditionLore />,
  secretPhrase: <SecretPhraseLore />,
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const tokenUser = await getTokenUser(session);
  const user = await getUserProfile(tokenUser);

  return json({ user });
};

export default function LoreRoute() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <BaseLayout user={user}>
      <Stack spacing={32}>
        <Headline as="h1">Library</Headline>
        <Text>
          Welcome to the lore section. Here you can read about the different
          topics in the game.
        </Text>
        <Stack spacing={16} direction="horizontal">
          {Object.keys(lore).map((key) => {
            return (
              <div key={key}>
                <LoreText to={`/lore/${key}`} content={lore[key]}>
                  {key}
                </LoreText>
              </div>
            );
          })}
        </Stack>
      </Stack>
    </BaseLayout>
  );
}

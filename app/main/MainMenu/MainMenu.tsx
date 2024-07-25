import { Form } from "@remix-run/react";
import stylex from "@stylexjs/stylex";
import { UserProfile } from "~/auth/getUserProfile";
import { SecretPhraseLore } from "~/lore/SecretPhraseLore";
import { border, borderRadius, spacing, theme } from "~/tokens.stylex";

import { Button } from "~/ui/Button/Button";
import { TextField } from "~/ui/fields/TextField";
import { Fieldset } from "~/ui/form/Fieldset";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";
import { LoreText } from "~/ui/typography/LoreText";

import { Text } from "~/ui/typography/Text";

type Props = {
  user: UserProfile;
};

export function MainMenu({ user }: Props) {
  return (
    <Stack spacing={32}>
      <Headline size="sm" as="h2" weight="bold" color="primary">
        Well met, {user.displayName}
      </Headline>

      <section {...stylex.props(styles.section)}>
        <Stack spacing={16}>
          <Headline as="h3" size="sm" weight="regular" color="primary">
            Lead
          </Headline>
          <Text size="lg" weight="regular">
            {"The Company offers you an opportunity to lead an expedition."}
          </Text>

          <Form method="post" action="/lobby/create">
            <Fieldset>
              <input type="hidden" value={user.userId} name="userId" />
              <input
                type="hidden"
                value={user.displayName}
                name="displayName"
              />
              <Button type="submit" text="Lead an expedition" />
            </Fieldset>
          </Form>
        </Stack>
      </section>

      <section {...stylex.props(styles.section)}>
        <Stack spacing={16}>
          <Headline as="h3" size="sm" weight="regular" color="primary">
            Join
          </Headline>
          <Text size="lg" weight="regular">
            Or do you perhaps want to join an existing expedition? You need a{" "}
            <LoreText to="/lore/secretPhrase" content={<SecretPhraseLore />}>
              secret phrase
            </LoreText>{" "}
            to join.
          </Text>
          <Form method="post" action="/lobby/join">
            <Fieldset>
              <Stack spacing={16}>
                <input type="hidden" value={user.userId} name="userId" />
                <input
                  type="hidden"
                  value={user.displayName}
                  name="displayName"
                />
                <TextField
                  label="Secret phrase"
                  name="joinCode"
                  id="joinCode"
                />
                <Button type="submit" text="Join an expedition" />
              </Stack>
            </Fieldset>
          </Form>
        </Stack>
      </section>
    </Stack>
  );
}

const styles = stylex.create({
  section: {
    borderRadius: borderRadius.small,
    border: border.neutral2,
    background: theme.appBackground2,
    padding: spacing._16,
  },
});

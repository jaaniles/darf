import { Form } from "@remix-run/react";
import { UserProfile } from "~/auth/getUserProfile.server";

import { Button } from "~/ui/Button/Button";
import { TextField } from "~/ui/fields/TextField";
import { Fieldset } from "~/ui/form/Fieldset";
import { Link } from "~/ui/Link/Link";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";

import { Text } from "~/ui/typography/Text";

type Props = {
  user: UserProfile;
};

export function MainMenu({ user }: Props) {
  return (
    <Stack spacing={32}>
      <Text>Well met, {user.displayName}</Text>

      <Form method="post" action="/lobby/create">
        <Fieldset>
          <input type="hidden" value={user.uid} name="userId" />
          <input type="hidden" value={user.displayName} name="displayName" />
          <Button type="submit" text="Start an expedition" />
        </Fieldset>
      </Form>

      <Headline as="h2">Join an expedition</Headline>
      <Form method="post" action="/lobby/join">
        <Fieldset>
          <Stack spacing={16}>
            <input type="hidden" value={user.uid} name="userId" />
            <input type="hidden" value={user.displayName} name="displayName" />
            <TextField label="Code" name="joinCode" id="joinCode" />
            <Button type="submit" text="Request to join" />
          </Stack>
        </Fieldset>
      </Form>

      <Link to="/logout">{">"} Logout</Link>
    </Stack>
  );
}

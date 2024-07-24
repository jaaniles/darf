import { Form } from "@remix-run/react";
import { UserProfile } from "~/auth/getUserProfile.server";

import { Button } from "~/ui/Button/Button";
import { TextField } from "~/ui/fields/TextField";
import { Fieldset } from "~/ui/form/Fieldset";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";
import { Text } from "~/ui/typography/Text";

type Props = {
  user: UserProfile;
};

export function EditProfile({ user }: Props) {
  console.log("what is user?", user);

  return (
    <Form method="post">
      <Fieldset>
        <Stack spacing={16}>
          <Headline as="h1">Expedition profile</Headline>
          <Text>
            The Company requires you to register your official Dwarven name.
          </Text>
          <input type="hidden" value={user?.uid} name="userId" />
          <TextField
            label="Drawf name"
            id="displayName"
            name="displayName"
            defaultValue={user?.displayName}
          />
          <Button type="submit" text="Save" />
        </Stack>
      </Fieldset>
    </Form>
  );
}

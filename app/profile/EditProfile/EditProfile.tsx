import { Form } from "@remix-run/react";
import { UserProfile } from "~/auth/getUserProfile.server";

import { Button } from "~/ui/Button/Button";
import { TextField } from "~/ui/fields/TextField";
import { Fieldset } from "~/ui/form/Fieldset";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";

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
          <input type="hidden" value={user?.uid} name="userId" />
          <TextField
            label="Display name"
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

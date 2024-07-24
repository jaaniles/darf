import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import { DecodedIdToken } from "firebase-admin/auth";

import { requireUserSession } from "~/session.server";
import { Button } from "~/ui/Button/Button";
import { TextField } from "~/ui/fields/TextField";
import { Fieldset } from "~/ui/form/Fieldset";
import { BaseLayout } from "~/ui/Layout/BaseLayout";
import { Link } from "~/ui/Link/Link";
import { Stack } from "~/ui/Stack/Stack";
import { Headline } from "~/ui/typography/Headline";

export const meta: MetaFunction = () => {
  return [
    { title: "Darf" },
    { name: "description", content: "A great game for game enthusiasts" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = (await requireUserSession(request)) as DecodedIdToken;

  return json({
    uid: session.uid,
  });
};

export default function Index() {
  const { uid } = useLoaderData<typeof loader>();

  return (
    <BaseLayout>
      <Stack spacing={32}>
        <Headline as="h1">Greetings, dwarf</Headline>
        <Form method="post" action="/lobby/create">
          <Fieldset>
            <input type="hidden" value={uid} name="userId" />
            <Button type="submit" text="Start an expedition" />
          </Fieldset>
        </Form>

        <Headline as="h2">Join an expedition</Headline>
        <Form method="post" action="/lobby/join">
          <Fieldset>
            <Stack spacing={16}>
              <input type="hidden" value={uid} name="userId" />
              <TextField label="Code" name="joinCode" id="joinCode" />
              <Button type="submit" text="Request to join" />
            </Stack>
          </Fieldset>
        </Form>

        <Link to="/logout">{">"} Logout</Link>
      </Stack>
    </BaseLayout>
  );
}

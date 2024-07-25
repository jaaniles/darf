import { Text } from "~/ui/typography/Text";

export const SecretPhraseLore = () => (
  <div>
    <Text weight="regular">
      {`To improve security, the Expedition implemented a secret phrase system.\n\n`}
    </Text>
    <Text weight="regular">
      {`Each new expedition has a secret phrase and only by knowing it can a new member join the expedition.\n\n`}
    </Text>
    <Text weight="regular">
      {`The black market is full of fake secret phrases, so be careful who you trust. Lucky few find a real one and reap the benefits.`}
    </Text>
  </div>
);

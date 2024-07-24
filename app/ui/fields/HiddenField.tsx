import { HiddenInput } from "~/ui/inputs/HiddenInput";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  id: string;
  name: string;
  defaultValue?: string;
};

export function HiddenField({ id, name, defaultValue }: Props) {
  return (
    <Stack spacing={4}>
      <HiddenInput id={id} name={name} defaultValue={defaultValue} />
    </Stack>
  );
}

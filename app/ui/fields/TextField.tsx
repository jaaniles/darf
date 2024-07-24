import { TextInput } from "~/ui/inputs/TextInput";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string | undefined;
  error?: string | undefined;
};

export function TextField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
}: Props) {
  return (
    <Stack spacing={4}>
      <label htmlFor={id}>{label}</label>

      <TextInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </Stack>
  );
}

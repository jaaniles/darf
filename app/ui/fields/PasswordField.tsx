import { PasswordInput } from "~/ui/inputs/PasswordInput";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string | undefined;
  error?: string | undefined;
};

export function PasswordField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
}: Props) {
  return (
    <Stack spacing={4}>
      <label htmlFor={id}>{label}</label>

      <PasswordInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </Stack>
  );
}

import { EmailInput } from "~/ui/inputs/EmailInput";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string | undefined;
  error?: string | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EmailField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
  onChange,
}: Props) {
  return (
    <Stack spacing={4}>
      <label htmlFor={id}>{label}</label>

      <EmailInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onChange={onChange}
      />
    </Stack>
  );
}

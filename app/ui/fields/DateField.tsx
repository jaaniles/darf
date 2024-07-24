import { DateInput } from "~/ui/inputs/DateInput";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string | undefined;
  error?: string | undefined;
};

export function DateField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
}: Props) {
  return (
    <Stack spacing={4}>
      <label htmlFor={id}>{label}</label>

      <DateInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </Stack>
  );
}

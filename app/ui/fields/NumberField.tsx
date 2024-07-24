import { NumberInput } from "~/ui/inputs/NumberInput";
import { Stack } from "~/ui/Stack/Stack";

type Props = {
  id: string;
  name: string;
  label: string;
  defaultValue?: number;
  placeholder?: string | undefined;
  error?: string | undefined;
};

export function NumberField({
  id,
  name,
  label,
  defaultValue,
  placeholder,
}: Props) {
  return (
    <Stack spacing={4}>
      <label htmlFor={id}>{label}</label>

      <NumberInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </Stack>
  );
}

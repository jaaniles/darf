import { Input } from "~/ui/inputs/Input";

type Props = {
  id: string;
  name: string;
  defaultValue?: number | undefined;
  placeholder?: string | undefined;
  hasError?: boolean;
};

export function NumberInput({
  id,
  name,
  defaultValue,
  placeholder,
  hasError,
}: Props) {
  return (
    <Input
      id={id}
      name={name}
      type="number"
      defaultValue={defaultValue}
      placeholder={placeholder}
      hasError={hasError}
    />
  );
}

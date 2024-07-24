import { Input } from "~/ui/inputs/Input";

type Props = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
  placeholder?: string | undefined;
  hasError?: boolean;
};

export function HiddenInput({
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
      type="hidden"
      defaultValue={defaultValue}
      placeholder={placeholder}
      hasError={hasError}
    />
  );
}

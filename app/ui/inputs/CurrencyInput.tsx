import { Input } from "~/ui/inputs/Input";

type Props = {
  id: string;
  name: string;
  defaultValue?: number | undefined;
  placeholder?: string | undefined;
  hasError?: boolean;
};

export function CurrencyInput({
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
      currency="€"
      defaultValue={defaultValue}
      placeholder={placeholder}
      hasError={hasError}
    />
  );
}

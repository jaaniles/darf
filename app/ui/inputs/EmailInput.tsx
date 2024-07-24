import { Input } from "~/ui/inputs/Input";

type Props = {
  id: string;
  name: string;
  defaultValue?: string | undefined;
  placeholder?: string | undefined;
  hasError?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EmailInput({
  id,
  name,
  defaultValue,
  placeholder,
  hasError,
  onChange,
}: Props) {
  return (
    <Input
      id={id}
      name={name}
      type="email"
      defaultValue={defaultValue}
      placeholder={placeholder}
      hasError={hasError}
      onChange={onChange}
    />
  );
}

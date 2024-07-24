import stylex from "@stylexjs/stylex";
import { spacing, theme } from "~/tokens.stylex";
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
      <label htmlFor={id} {...stylex.props(labelStyles.root)}>
        {label}
      </label>

      <TextInput
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </Stack>
  );
}

const labelStyles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: spacing._8,
    cursor: "pointer",
    lineHeight: 1.2,
    letterSpacing: "1%",

    color: theme.textPrimary,
  },
});

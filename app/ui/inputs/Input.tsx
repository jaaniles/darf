import * as stylex from "@stylexjs/stylex";
import {
  border,
  borderRadius,
  colors,
  fontSize,
  spacing,
} from "~/tokens.stylex";

type Props = {
  id: string;
  name: string;
  type?: "text" | "email" | "password" | "number" | "date" | "hidden";
  currency?: "€" | "$" | undefined;
  defaultValue?: string | number | undefined;
  placeholder?: string | undefined;
  hasError?: boolean;
  style?: stylex.StyleXStyles;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({
  id,
  name,
  type = "text",
  currency,
  defaultValue,
  placeholder,
  hasError,
  style,
  onChange,
}: Props) {
  const state = hasError ? "error" : "default";

  return (
    <div {...stylex.props(styles.root)}>
      <input
        id={id}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
        onChange={onChange}
        {...stylex.props(
          styles.input,
          currency && styles.inputWithCurrency,
          stateStyles[state],
          style
        )}
      />
      {currency && <span {...stylex.props(styles.currency)}>{currency}</span>}
    </div>
  );
}

const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    fontSize: fontSize.input,
    padding: spacing._8,
    borderRadius: borderRadius.input,

    color: colors.gray12,
    background: "none",
    border: {
      default: border.input,
      ":focus": border.transparent,
    },

    outline: {
      default: "none",
      ":hover": border.inputHover,
      ":focus": border.input,
    },

    "::placeholder": {
      color: colors.gray5,
    },

    "-moz-appearance": "textfield",
  },
  currency: {
    position: "absolute",
    top: "50%",
    left: spacing._8,

    transform: "translateY(-50%)",
  },
  inputWithCurrency: {
    paddingLeft: spacing._32,
    letterSpacing: "0.1em",
  },
});

const stateStyles = stylex.create({
  default: {},
  error: {
    borderColor: colors.red5,
  },
});

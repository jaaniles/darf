import stylex from "@stylexjs/stylex";
import { ReactNode } from "react";
import { border, borderRadius, spacing, theme } from "~/tokens.stylex";
import { Text } from "~/ui/typography/Text";

type Props = {
  text: string;
  type: "button" | "submit";
  name?: string;
  value?: string;
  variant?: "primary" | "secondary";
  align?: "start" | "center" | "end";
  full?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
};

export function Button({
  text,
  type = "button",
  name,
  value,
  variant = "primary",
  align = "start",
  full = false,
  disabled = false,
  icon,
  onClick,
}: Props) {
  return (
    <button
      name={name}
      type={type}
      value={value}
      {...stylex.props(
        styles.root,
        variantStyles[variant],
        alignStyles[align],
        full && styles.full
      )}
      aria-disabled={disabled}
      onClick={onClick}
    >
      {icon && <span {...stylex.props(styles.icon)}>{icon}</span>}
      <Text size="lg" color="inherit" weight="regular">
        {text}
      </Text>
    </button>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    position: "relative",

    height: 40,

    justifyContent: "center",
    alignItems: "center",
    minWidth: "64px",
    borderRadius: borderRadius.button,
    paddingLeft: spacing._24,
    paddingRight: spacing._24,
    cursor: { default: "initial", ":hover": "pointer" },

    gap: spacing._8,

    fontFamily: "Oxygen",
    fontWeight: 400,
  },
  icon: {
    verticalAlign: "middle",
  },
  hidden: {
    opacity: 0,
  },
  full: {
    width: "100%",
  },
});

const variantStyles = stylex.create({
  primary: {
    color: theme.textPrimary,
    border: border.interactive,
    background: {
      default: theme.accentBackground,
      ":hover": theme.accentBackgroundHover,
      ":active": theme.accentBackgroundActive,
    },
    borderColor: {
      default: theme.accentBorder,
      ":hover": theme.accentBorderHover,
      ":active": theme.accentBorderInteractive,
    },
  },
  secondary: {
    background: "none",
    border: border.interactive,
    color: {
      default: theme.textPrimary,
      ":hover": theme.textPrimaryHover,
      ":active": theme.textPrimary,
    },
    borderColor: {
      default: theme.accentBorder,
      ":hover": theme.accentBorderHover,
      ":active": theme.accentBorderInteractive,
    },
  },
});

const alignStyles = stylex.create({
  start: {
    alignSelf: "start",
  },
  center: {
    alignSelf: "center",
  },
  end: {
    alignSelf: "end",
  },
});

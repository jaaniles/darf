import { Link as RemixLink } from "@remix-run/react";
import * as stylex from "@stylexjs/stylex";

import { theme } from "~/tokens.stylex";

type Props = {
  to: To;
  variant?: "default" | "unstyled";
  external?: boolean | undefined;
  disabled?: boolean;
  style?: stylex.StyleXStyles;
  children: React.ReactNode;
};

export type To = string;

export function Link({
  to,
  variant = "default",
  external = false,
  disabled = false,
  style,
  children,
}: Props) {
  return (
    <RemixLink
      to={to}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      {...stylex.props(
        variantStyles[variant],
        disabled && linkStyles.disabled,
        style
      )}
    >
      {children}
    </RemixLink>
  );
}

const linkStyles = stylex.create({
  disabled: {
    color: theme.textDisabled,
    pointerEvents: "none",
  },
});

const variantStyles = stylex.create({
  default: {
    color: {
      default: theme.link,
      ":hover": theme.linkHover,
      ":visited": theme.linkVisited,
    },
    textDecoration: {
      default: "none",
      ":hover": "underline",
    },
  },
  unstyled: {
    color: "inherit",
    textDecoration: "none",
  },
});

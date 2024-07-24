import * as stylex from "@stylexjs/stylex";
import { ReactNode } from "react";

import { fontSize, theme } from "~/tokens.stylex";

export type Props = {
  children: ReactNode;
  as: "h1" | "h2" | "h3" | "h4" | "span";
  size?: "sm" | "md" | "lg" | "hg";
  weight?: "light" | "regular" | "bold";
  color?: "white" | "primary" | "disabled" | "error";
  align?: "left" | "center" | "right";
};

export function Headline({
  children,
  as,
  size = "lg",
  weight = "light",
  color = "white",
  align = "left",
}: Props) {
  const Component = as;

  return (
    <Component
      {...stylex.props(
        styles.root,
        fontSizeStyles[size],
        colorStyles[color],
        textAlignStyles[align],
        weightStyles[weight]
      )}
    >
      {children}
    </Component>
  );
}

const styles = stylex.create({
  root: {
    lineHeight: 1.2,
    letterSpacing: "1%",
    margin: 0,
    fontWeight: 300,
  },
});

const fontSizeStyles = stylex.create({
  sm: {
    fontSize: fontSize.headlineSmall,
  },
  md: {
    fontSize: fontSize.headlineMedium,
  },
  lg: {
    fontSize: fontSize.headlineLarge,
  },
  hg: {
    fontSize: fontSize.headlineHuge,
  },
});

const colorStyles = stylex.create({
  white: {
    color: theme.textNeutral,
  },
  primary: {
    color: theme.textPrimary,
  },
  disabled: {
    color: theme.textDisabled,
  },
  error: {
    color: theme.textError,
  },
});

const textAlignStyles = stylex.create({
  left: {
    textAlign: "left",
  },
  center: {
    textAlign: "center",
  },
  right: {
    textAlign: "right",
  },
});

const weightStyles = stylex.create({
  light: {
    fontWeight: 300,
  },
  regular: {
    fontWeight: 400,
  },
  bold: {
    fontWeight: 700,
  },
});

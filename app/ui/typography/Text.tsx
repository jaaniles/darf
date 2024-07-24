import * as stylex from "@stylexjs/stylex";
import { ReactNode } from "react";

import { fontSize, theme } from "~/tokens.stylex";

export type Props = {
  children: ReactNode;
  size?: Size | undefined;
  weight?: "light" | "regular" | "bold";
  color?: "white" | "primary" | "secondary" | "error" | "inherit";
  align?: "left" | "center" | "right";
  uppercase?: boolean;
  lineClamp?: 3;
  style?: stylex.StyleXStyles;
};

export type Size = "sm" | "md" | "lg";

export type Weight = "regular" | "medium";

export type FontFamily = "inter" | "barlow";

export function Text({
  children,
  size = "md",
  weight = "light",
  color = "white",
  align = "left",
  uppercase = false,
  lineClamp,
  style,
}: Props) {
  return (
    <span
      {...stylex.props(
        styles.root,
        fontSizeStyles[size],
        colorStyles[color],
        textAlignStyles[align],
        uppercase && styles.uppercase,
        lineClamp && lineClampStyles[lineClamp],
        weight && weightStyles[weight],
        style
      )}
    >
      {children}
    </span>
  );
}

const styles = stylex.create({
  root: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
    maxWidth: "70ch",
  },
  uppercase: {
    textTransform: "uppercase",
  },
});

const fontSizeStyles = stylex.create({
  sm: {
    fontSize: fontSize.bodySmall,
  },
  md: {
    fontSize: fontSize.bodyMedium,
  },
  lg: {
    fontSize: fontSize.bodyLarge,
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

const colorStyles = stylex.create({
  white: {
    color: theme.textNeutral,
  },
  primary: {
    color: theme.text,
  },
  secondary: {
    color: theme.textSecondary,
  },
  error: {
    color: theme.textError,
  },
  inherit: {
    color: "inherit",
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

const lineClampStyles = stylex.create({
  3: {
    display: "-webkit-box",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "-webkitLineClamp": "3",
    "-webkitBoxOrient": "vertical",
  },
});

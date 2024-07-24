import * as stylex from "@stylexjs/stylex";
import { ReactNode } from "react";

import { spacing } from "~/tokens.stylex";

export type StackSpacing = 4 | 8 | 16 | 32 | 48 | 72 | 98;

export type Props = {
  children: ReactNode;
  spacing: StackSpacing;
  direction?: "vertical" | "horizontal";
  align?: "initial" | "start" | "center" | "end";
  alignVertical?: "initial" | "start" | "center" | "end";
  style?: stylex.StyleXStyles;
};

export function Stack({
  children,
  spacing,
  direction = "vertical",
  align = "initial",
  alignVertical = "initial",
  style,
}: Props) {
  return (
    <div
      {...stylex.props(
        styles.root,
        spacingStyles[spacing],
        directionStyles[direction],
        direction === "vertical" && alignItemsStyles[align],
        direction === "vertical" && justifyContentStyles[alignVertical],
        direction === "horizontal" && alignItemsStyles[alignVertical],
        direction === "horizontal" && justifyContentStyles[align],
        style
      )}
    >
      {children}
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
  },
});

const spacingStyles = stylex.create({
  4: {
    gap: spacing._4,
  },
  8: {
    gap: spacing._8,
  },
  16: {
    gap: spacing._16,
  },
  32: {
    gap: spacing._32,
  },
  48: {
    gap: spacing._48,
  },
  72: {
    gap: spacing._72,
  },
  98: {
    gap: spacing._98,
  },
});

const directionStyles = stylex.create({
  vertical: {
    flexDirection: "column",
  },
  horizontal: {
    flexDirection: "row",
  },
});

const alignItemsStyles = stylex.create({
  initial: {
    alignItems: "initial",
  },
  start: {
    alignItems: "flex-start",
  },
  center: {
    alignItems: "center",
  },
  end: {
    alignItems: "flex-end",
  },
});

const justifyContentStyles = stylex.create({
  initial: {
    justifyContent: "initial",
  },
  start: {
    justifyContent: "flex-start",
  },
  center: {
    justifyContent: "center",
  },
  end: {
    justifyContent: "flex-end",
  },
});

import stylex from "@stylexjs/stylex";
import { ReactNode } from "react";
import { border, borderRadius, spacing } from "~/tokens.stylex";
import { HoverCard } from "~/ui/HoverCard/HoverCard";
import { To } from "~/ui/Link/Link";
import { Text } from "~/ui/typography/Text";

type Props = {
  children: ReactNode;
  content: ReactNode;
  to: To;
};

export function LoreText({ children, to, content }: Props) {
  return (
    <HoverCard content={content} to={to}>
      <Text style={styles.root} size="lg" weight="bold" color="secondary">
        {children}
      </Text>
    </HoverCard>
  );
}

const styles = stylex.create({
  root: {
    cursor: "pointer",
    padding: `1px ${spacing._8}`,
    border: {
      default: border.default,
      ":hover": border.hover,
    },
    borderRadius: borderRadius.container,
  },
});

import stylex from "@stylexjs/stylex";
import { ReactNode } from "react";
import { border, borderRadius, spacing } from "~/tokens.stylex";
import { HoverCard } from "~/ui/HoverCard/HoverCard";
import { Text } from "~/ui/typography/Text";

type Props = {
  children: ReactNode;
  content: ReactNode;
};

export function LoreText({ children, content }: Props) {
  return (
    <HoverCard content={content}>
      <Text style={styles.root} size="lg" weight="bold" color="secondary">
        {children}
      </Text>
    </HoverCard>
  );
}

const styles = stylex.create({
  root: {
    cursor: "pointer",
    padding: `4px ${spacing._8}`,
    border: border.default,
    borderRadius: borderRadius.container,
  },
});

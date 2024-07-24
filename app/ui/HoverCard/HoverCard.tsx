import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import stylex from "@stylexjs/stylex";
import { ReactNode } from "react";
import { borderRadius, spacing, theme } from "~/tokens.stylex";

type Props = {
  children: ReactNode;
  content: ReactNode;
};

export function HoverCard({ children, content }: Props) {
  return (
    <HoverCardPrimitive.Root>
      <HoverCardPrimitive.Trigger>{children}</HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          sideOffset={8}
          {...stylex.props(styles.content)}
        >
          <HoverCardPrimitive.Arrow {...stylex.props(styles.arrow)} />
          {content}
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}

const styles = stylex.create({
  content: {
    borderRadius: borderRadius.container,
    padding: spacing._16,

    background: theme.appBackground2,

    maxWidth: 350,
  },
  arrow: {
    fill: theme.appBackground2,
  },
});

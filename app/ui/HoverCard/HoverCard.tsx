import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { useNavigate } from "@remix-run/react";
import stylex from "@stylexjs/stylex";
import { ReactNode } from "react";
import { border, borderRadius, spacing, theme } from "~/tokens.stylex";
import { To } from "~/ui/Link/Link";

type Props = {
  children: ReactNode;
  content: ReactNode;
  to?: To;
};

export function HoverCard({ children, content, to }: Props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (!to) {
      return;
    }

    navigate(to);
  };

  return (
    <HoverCardPrimitive.Root>
      <HoverCardPrimitive.Trigger onClick={handleNavigate}>
        {children}
      </HoverCardPrimitive.Trigger>
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

    background: theme.appBackground1,
    border: border.neutral,

    maxWidth: 350,
  },
  arrow: {
    fill: theme.appBackground1,
  },
});

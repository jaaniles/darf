import stylex from "@stylexjs/stylex";

import { spacing, theme } from "~/tokens.stylex";
import { Navigation } from "~/ui/navigation/Navigation";

type Props = {
  children: React.ReactNode;
};

export function BaseLayout({ children }: Props) {
  return (
    <div {...stylex.props(styles.root)}>
      <Navigation />
      <main {...stylex.props(styles.content)}>{children}</main>
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    gap: spacing._32,

    background: theme.appBackground1,
    color: theme.text,
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",

    width: "100%",
    maxWidth: 768,
  },
});

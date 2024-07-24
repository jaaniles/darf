import stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";

import { spacing, theme } from "~/tokens.stylex";
import { Navigation } from "~/ui/navigation/Navigation";
import { PageLoadIndicator } from "~/ui/PageLoadIndicator/PageLoadIndicator";

type Props = {
  children: React.ReactNode;
};

export function BaseLayout({ children }: Props) {
  return (
    <motion.div {...stylex.props(styles.root)}>
      <PageLoadIndicator />
      <Navigation />
      <main {...stylex.props(styles.content)}>{children}</main>
    </motion.div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    gap: spacing._32,

    background: theme.appBackground1,

    color: theme.text,
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",

    width: "100%",
    maxWidth: 768,

    padding: spacing._32,
  },
});

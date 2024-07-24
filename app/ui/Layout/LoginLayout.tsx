import stylex from "@stylexjs/stylex";

import { border, borderRadius, spacing, theme } from "~/tokens.stylex";
import { Headline } from "~/ui/typography/Headline";

type Props = {
  children: React.ReactNode;
};

export function LoginLayout({ children }: Props) {
  return (
    <main {...stylex.props(styles.root)}>
      <Headline as="h1" size="hg" color="primary">
        DARF
      </Headline>

      <div {...stylex.props(styles.content)}>{children}</div>
    </main>
  );
}

const MOBILE = "@media (max-width: 619px)";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: {
      default: "center",
      [MOBILE]: "center",
    },

    gap: spacing._32,
    padding: `${spacing._98} ${spacing._16} ${spacing._16} ${spacing._16}`,
    background:
      "radial-gradient(circle, rgba(17,19,31,1) 0%, rgba(17,19,31,1) 10%, rgba(17,17,19,1) 100%)",

    color: theme.text,
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flexDirection: "column",

    background: theme.appBackground1,
    border: border.container,
    borderRadius: borderRadius.big,

    padding: `${spacing._32} ${spacing._32}`,

    width: "100%",
    maxWidth: 350,
  },
});

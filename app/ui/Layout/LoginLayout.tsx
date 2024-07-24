import stylex from "@stylexjs/stylex";

import { spacing, theme } from "~/tokens.stylex";
import { Headline } from "~/ui/typography/Headline";

import splash from "~/assets/img/splash.png";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export function LoginLayout({ children }: Props) {
  return (
    <motion.main
      {...stylex.props(styles.root)}
      initial={{
        background: `radial-gradient(at 20%, rgba(48,32,8,1) 15%, rgba(17,19,31,1) 50%, rgba(17,17,19,1) 100%)`,
      }}
      animate={{
        background: `radial-gradient(at 0%, rgba(17,19,31,1) 0%, rgba(17,19,31,1) 10%, rgba(17,17,19,1) 100%)`,
        transition: {
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "anticipate",
        },
      }}
    >
      <Headline as="h1" size="hg" color="primary" weight="bold" align="center">
        DARF
      </Headline>

      <motion.img
        {...stylex.props(styles.splash)}
        src={splash}
        alt="Splash of a dwarf examining a diamond"
        initial={{
          filter: "grayscale(0%)",
          opacity: 1,
        }}
        animate={{
          filter: "grayscale(100%)",
          opacity: 0.1,
          transition: {
            duration: 8,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "anticipate",
          },
        }}
      />

      <div {...stylex.props(styles.content)}>{children}</div>
    </motion.main>
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
      [MOBILE]: "space-between",
    },

    gap: spacing._32,
    padding: `${spacing._98} ${spacing._16} ${spacing._16} ${spacing._16}`,

    color: theme.text,
    minHeight: "100vh",
  },
  content: {
    display: "flex",
    flexDirection: "column",

    padding: `${spacing._72} ${spacing._32}`,

    width: "100%",
    maxWidth: 350,
  },
  splash: {
    maxWidth: 250,
    width: "80%",
    height: "auto",
  },
});

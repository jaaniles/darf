import { GearIcon, HomeIcon } from "@radix-ui/react-icons";
import stylex from "@stylexjs/stylex";
import { borderRadius, colors, spacing, theme } from "~/tokens.stylex";
import { Link } from "~/ui/Link/Link";

export function Navigation() {
  return (
    <nav {...stylex.props(styles.root)}>
      <ul {...stylex.props(styles.ul)}>
        <li>
          <Link to="/">
            <HomeIcon width={25} height={25} />
          </Link>
        </li>
        <li>
          <Link to="/profile">
            <GearIcon width={25} height={25} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

const styles = stylex.create({
  root: {
    position: "fixed",
    bottom: 0,
    left: 0,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    background: theme.appBackground1,
    borderTop: `1px solid ${colors.slate2}`,
    borderRadius: borderRadius.small,
    width: "100%",

    height: 50,
  },
  ul: {
    listStyle: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    margin: 0,
    padding: `${spacing._8} ${spacing._16}`,

    gap: spacing._32,
  },
});

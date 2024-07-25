import {
  ArrowRightStartOnRectangleIcon,
  HomeIcon,
  UserIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { useLocation } from "@remix-run/react";
import stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import { UserProfile } from "~/auth/getUserProfile";
import { borderRadius, colors, spacing, theme } from "~/tokens.stylex";
import { Link } from "~/ui/Link/Link";

type Props = {
  user?: UserProfile;
};

export function Navigation({ user }: Props) {
  const location = useLocation();

  return (
    <nav {...stylex.props(styles.root)}>
      <ul {...stylex.props(styles.ul)}>
        <li {...stylex.props(styles.li)}>
          {location.pathname === "/" && <ActiveLinkIndicator />}
          <Link to="/">
            <HomeIcon width={30} height={30} />
          </Link>
        </li>
        <li {...stylex.props(styles.li)}>
          {location.pathname === "/library" && <ActiveLinkIndicator />}
          <Link to="/library">
            <AcademicCapIcon width={30} height={30} />
          </Link>
        </li>
        {user && (
          <li {...stylex.props(styles.li)}>
            {location.pathname === "/profile" && <ActiveLinkIndicator />}
            <Link to="/profile">
              <UserIcon width={30} height={30} />
            </Link>
          </li>
        )}
        {user && (
          <li>
            <Link to="/logout">
              <ArrowRightStartOnRectangleIcon width={30} height={30} />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

const ActiveLinkIndicator = () => (
  <motion.div
    layoutId="activeLinkIndicator"
    {...stylex.props(styles.activeIndicator)}
  />
);

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

    padding: `${spacing._8} 0px`,
    zIndex: 10,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    left: 0,

    background: theme.accentBackgroundActive,
    borderRadius: borderRadius.small,

    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  li: {
    position: "relative",
    padding: spacing._8,
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

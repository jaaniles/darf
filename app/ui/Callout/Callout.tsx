import * as stylex from "@stylexjs/stylex";

import { borderRadius, colors, spacing, theme } from "~/tokens.stylex";
import { Text } from "~/ui/typography/Text";
import {
  ChatBubbleBottomCenterTextIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

export type Props = {
  text: string;
  variant: Variant;
};

type Variant = "error" | "info";

export function Callout({ text, variant }: Props) {
  return (
    <div {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.accent, accentVariantStyles[variant])} />

      <div {...stylex.props(styles.icon, iconVariantStyles[variant])}>
        {variant === "error" && (
          <ExclamationTriangleIcon width={25} height={25} />
        )}
        {variant === "info" && (
          <ChatBubbleBottomCenterTextIcon width={25} height={25} />
        )}
      </div>

      <div {...stylex.props(styles.content, contentVariantStyles[variant])}>
        <Text size="md" style={textVariantStyles[variant]}>
          {text}
        </Text>
      </div>
    </div>
  );
}

const styles = stylex.create({
  root: {
    display: "flex",
    minHeight: 40,
  },
  accent: {
    width: 8,
    borderTopLeftRadius: borderRadius.container,
    borderBottomLeftRadius: borderRadius.container,
  },
  icon: {
    display: "flex",
    alignItems: "center",
    paddingInlineStart: spacing._16,
    borderBlockWidth: 1,
    borderBlockStyle: "solid",
  },
  content: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    padding: spacing._8,
    borderBlockWidth: 1,
    borderBlockStyle: "solid",
    borderInlineEndWidth: 1,
    borderInlineEndStyle: "solid",
    borderTopRightRadius: borderRadius.container,
    borderBottomRightRadius: borderRadius.container,
  },
});

const accentVariantStyles = stylex.create({
  error: {
    background: colors.red8,
  },
  info: {
    background: colors.cyan8,
  },
});

const iconVariantStyles = stylex.create({
  error: {
    color: theme.textError,
    background: theme.errorBackground,
    borderColor: theme.errorBorder,
  },
  info: {
    color: theme.textInfo,
    background: theme.infoBackground,
    borderColor: theme.infoBorder,
  },
});

const contentVariantStyles = stylex.create({
  error: {
    background: theme.errorBackground,
    borderColor: theme.errorBorder,
  },
  info: {
    background: theme.infoBackground,
    borderColor: theme.infoBorder,
  },
});

const textVariantStyles = stylex.create({
  error: {
    color: theme.textError,
  },
  info: {
    color: theme.textInfo,
  },
});

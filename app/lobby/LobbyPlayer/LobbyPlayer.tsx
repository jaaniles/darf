import { CheckIcon, ClockIcon, FireIcon } from "@heroicons/react/24/solid";
import stylex from "@stylexjs/stylex";
import { UserProfile } from "~/auth/getUserProfile";
import { border, borderRadius, colors, spacing, theme } from "~/tokens.stylex";
import { Button } from "~/ui/Button/Button";
import { Stack } from "~/ui/Stack/Stack";
import { Text } from "~/ui/typography/Text";

type Props = {
  lobbyId: string;
  userId: string;
  player: UserProfile;
  isReady: boolean;
  playerIsAdmin?: boolean;
  canKick?: boolean;
};

export function LobbyPlayer({
  lobbyId,
  userId,
  player,
  isReady,
  playerIsAdmin,
  canKick,
}: Props) {
  return (
    <li
      {...stylex.props(
        styles.root,
        isReady ? readyStyles.ready : readyStyles.notReady
      )}
    >
      <Stack direction="horizontal" spacing={8} alignVertical="center">
        <div
          {...stylex.props(
            styles.avatar,
            isReady ? readyStyles.ready : readyStyles.notReady
          )}
        >
          <Text color={isReady ? "success" : "error"} style={styles.icon}>
            {isReady && <CheckIcon width={25} height={25} />}
            {!isReady && <ClockIcon width={25} height={25} />}
          </Text>
        </div>

        <Text size="lg" weight="bold">
          {player.displayName}
        </Text>
      </Stack>

      {playerIsAdmin && (
        <FireIcon width={25} height={25} {...stylex.props(iconStyles.root)} />
      )}

      {canKick && userId !== player.userId && (
        <form method="POST" action={`/lobby/${lobbyId}/kick`}>
          <input type="hidden" name="userToKick" value={player.userId} />
          <input type="hidden" name="userId" value={userId} />
          <Button type="submit" text="Kick" />
        </form>
      )}
    </li>
  );
}

const styles = stylex.create({
  root: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    padding: `4px ${spacing._16} 4px ${spacing._8}`,
    borderRadius: borderRadius.big,
    border: border.default,
    borderColor: theme.successBorder,

    transition: "border-color 0.2s ease-in-out",
  },
  avatar: {
    width: 45,
    height: 45,

    transition: "border-color 0.2s ease-in-out",

    position: "relative",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateY(-38%) translateX(-50%)",
  },
});

const iconStyles = stylex.create({
  root: {
    verticalAlign: "middle",
    color: colors.amber9,
  },
});

const readyStyles = stylex.create({
  ready: {
    borderColor: theme.successBorder,
  },
  notReady: {
    borderColor: theme.errorBorder,
  },
});

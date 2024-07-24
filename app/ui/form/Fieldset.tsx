import stylex from "@stylexjs/stylex";
import { ReactNode } from "react";

type Props = {
  disabled?: boolean;
  children: ReactNode;
};

export function Fieldset({ disabled, children }: Props) {
  return (
    <fieldset disabled={disabled} {...stylex.props(styles.root)}>
      {children}
    </fieldset>
  );
}

const styles = stylex.create({
  root: {
    border: "none",
    padding: 0,
  },
});

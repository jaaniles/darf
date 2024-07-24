import { motion, useAnimate } from "framer-motion";
import stylex from "@stylexjs/stylex";
import { useCallback, useEffect } from "react";
import { useNavigation } from "@remix-run/react";

export const PageLoadIndicator = () => {
  const navigation = useNavigation();
  const [scope, animate] = useAnimate();

  const reset = useCallback(() => {
    animate(
      scope.current,
      {
        x: "15%",
        width: "15%",
        opacity: 0,
      },
      {
        duration: 0,
      }
    );
  }, [animate, scope]);

  const finishAnimation = useCallback(async () => {
    await animate(
      scope.current,
      {
        x: "100%",
        width: "100%",
        opacity: 1,
      },
      { ease: "easeOut", duration: 0.5 }
    );

    reset();
  }, [animate, scope, reset]);

  useEffect(() => {
    switch (navigation.state) {
      case "loading": {
        animate(
          scope.current,
          {
            opacity: 1,
            width: "35%",
            x: "100%",
          },
          { ease: "easeIn", repeat: Infinity, duration: 3.5 }
        );
        return;
      }
      default: {
        finishAnimation();
      }
    }
  }, [navigation.state, animate, scope, finishAnimation]);

  return <motion.div {...stylex.props(styles.root)} ref={scope} />;
};

const styles = stylex.create({
  root: {
    position: "fixed",
    background: "#7700ff",
    top: 0,
    left: 0,

    borderRadius: 4,
    height: 8,
  },
});

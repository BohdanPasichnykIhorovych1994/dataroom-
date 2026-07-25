import { motion, type HTMLMotionProps } from "motion/react";
import { fadePresence } from "@/motion/presets";

type FadeProps = HTMLMotionProps<"div">;

export function Fade({ children, ...props }: FadeProps) {
  return (
    <motion.div {...fadePresence} {...props}>
      {children}
    </motion.div>
  );
}

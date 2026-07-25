import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { fadePresence } from "@/motion/presets";

export function AuthFadeLayout() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...fadePresence} className="h-full">
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

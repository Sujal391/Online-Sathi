"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
        <Sun className="h-[1.2rem] w-[1.2rem] opacity-20" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 active:scale-90"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ y: 20, rotate: 90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, rotate: 90, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: -20, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

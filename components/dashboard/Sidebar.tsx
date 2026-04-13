"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { useAuth } from "@/store/auth.store";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);
  const role = user?.identity || "USER";
  const menuItems = SIDEBAR_ITEMS[role] || SIDEBAR_ITEMS.USER;

  const handleLogout = () => {
    authService.logout();
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "hidden md:flex flex-col h-screen border-r border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl sticky top-0 left-0 z-50 transition-all duration-300 ease-in-out",
        isCollapsed ? "px-3" : "px-4"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "h-20 flex items-center mb-6",
        isCollapsed ? "justify-center" : "justify-between px-2"
      )}>
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              key="full-logo"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">
                Online <span className="text-indigo-600 dark:text-indigo-400">Saathi</span>
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="mini-logo"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-12 h-12 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white"
            >
              <ShieldCheck className="w-7 h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1.5 py-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer Section */}
      <div className="py-6 border-t border-zinc-200 dark:border-white/5 space-y-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full h-11 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors group",
            isCollapsed ? "justify-center px-0" : "justify-start px-3 gap-3"
          )}
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </Button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-400 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
}

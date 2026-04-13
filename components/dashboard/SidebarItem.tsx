"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarItemProps {
  title: string;
  href: string;
  icon: string;
  isCollapsed?: boolean;
}

export function SidebarItem({ title, href, icon, isCollapsed }: SidebarItemProps) {
  const pathname = usePathname();
  // For dashboard roots, we want exact match only to avoid double highlighting
  // For other items, we allow prefix matching for nested routes
  const isDashboardRoot = ['/user', '/admin', '/super-admin', '/agent', '/state-head', '/state-partner', '/district-partner', '/country-head', '/sub-admin'].includes(href);
  const isActive = isDashboardRoot ? pathname === href : (pathname === href || pathname.startsWith(href + "/"));
  
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.HelpCircle;

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
          isActive 
            ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20" 
            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-100"
        )}
      >
        <IconComponent className={cn(
          "w-5 h-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
          isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
        )} />
        
        {!isCollapsed && (
          <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
            {title}
          </span>
        )}

        {isActive && (
          <motion.div 
            layoutId="active-pill"
            className="absolute left-0 w-1 h-1/2 bg-white rounded-r-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}

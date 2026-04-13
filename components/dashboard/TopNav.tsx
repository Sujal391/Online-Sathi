"use client";

import { useAuth } from "@/store/auth.store";
import { ModeToggle } from "@/components/shared/ModeToggle";
import { 
  Bell, 
  Search, 
  Menu,
  ChevronRight,
  User as UserIcon,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./MobileSidebar";
import { useState, useEffect } from "react";

export function TopNav() {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Format breadcrumbs from pathname
  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "));

  return (
    <header className="h-20 border-b border-zinc-200 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between transition-all">
      {/* Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-5 h-5 text-zinc-500" />
        </Button>

        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <span className="text-zinc-400">Dashboard</span>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700" />
              <span className={index === breadcrumbs.length - 1 ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500"}>
                {crumb}
              </span>
            </div>
          ))}
        </div>
      </div>

      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden lg:relative lg:flex items-center group">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" />
          <Input 
            placeholder="Search anything..." 
            className="pl-10 w-64 h-10 bg-zinc-100/50 dark:bg-white/5 border-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 placeholder:text-zinc-400 transition-all rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="relative group rounded-xl">
            <Bell className="w-5 h-5 text-zinc-500 group-hover:text-indigo-600 transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-zinc-900" />
          </Button>
          
          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-1 h-auto rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3 pl-1 pr-2">
                  <Avatar className="w-9 h-9 border-2 border-white dark:border-zinc-800 shadow-sm">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300">
                      {mounted ? (user?.identity?.charAt(0) || "U") : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                      {mounted ? (user?.identity || "Guest User") : "Loading..."}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                      {mounted ? (user?.identity?.replace(/-/g, " ") || "Member") : "..."}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border-zinc-200 dark:border-white/10 p-2 shadow-2xl">
              <DropdownMenuLabel className="px-3 py-2">
                <p className="text-sm font-bold">Account Options</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-white/5" />
              <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-500/10">
                <UserIcon className="w-4 h-4 mr-2" /> Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer focus:bg-indigo-50 dark:focus:bg-indigo-500/10">
                <ShieldCheck className="w-4 h-4 mr-2" /> Security Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-100 dark:bg-white/5" />
              <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

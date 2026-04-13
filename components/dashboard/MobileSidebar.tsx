"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SidebarItem } from "./SidebarItem";
import { SIDEBAR_ITEMS } from "@/lib/constants";
import { useAuth } from "@/store/auth.store";
import { ShieldCheck, LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { user } = useAuth();
  const role = user?.identity || "USER";
  const menuItems = SIDEBAR_ITEMS[role] || SIDEBAR_ITEMS.USER;

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-[300px] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200 dark:border-white/10">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b border-zinc-200 dark:border-white/10">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
                Online <span className="text-indigo-600 dark:text-indigo-400">Saathi</span>
              </span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.href} onClick={onClose}>
                  <SidebarItem {...item} isCollapsed={false} />
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-zinc-200 dark:border-white/10">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full h-12 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 justify-start gap-4 px-4 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-semibold">Logout Account</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

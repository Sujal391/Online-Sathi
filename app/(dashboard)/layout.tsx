"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Top Navigation */}
        <TopNav />

        {/* Scrollable Dashboard Content */}
        <main 
          key={pathname}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50 dark:bg-zinc-950/50 custom-scrollbar"
        >
          <div className="max-w-[1600px] mx-auto min-h-full p-4 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

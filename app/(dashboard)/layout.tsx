import { ModeToggle } from "@/components/shared/ModeToggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
      <header className="h-16 border-b border-black/5 dark:border-white/5 flex items-center justify-between px-6 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Online Saathi
        </h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </header>
      <div className="flex-1 flex flex-col p-6">
        {children}
      </div>
    </div>
  );
}

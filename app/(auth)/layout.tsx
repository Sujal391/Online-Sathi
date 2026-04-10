import { ModeToggle } from "@/components/shared/ModeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#030303] transition-colors duration-500">
      <div className="absolute top-6 right-6 z-50">
        <ModeToggle />
      </div>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

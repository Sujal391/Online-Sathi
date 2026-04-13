"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Home, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const adminNavItems = [
    {
        href: "/admin",
        label: "Overview",
        icon: Home,
        match: (pathname: string) => pathname === "/admin",
    },
    {
        href: "/admin/jobs",
        label: "Job Posts",
        icon: Briefcase,
        match: (pathname: string) =>
            pathname === "/admin/jobs" || pathname.startsWith("/admin/jobs/"),
    },
    {
        href: "/admin/jobs/create",
        label: "Create Job",
        icon: Plus,
        match: (pathname: string) => pathname === "/admin/jobs/create",
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <section className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white/85 shadow-sm shadow-zinc-200/60 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/60 dark:shadow-none"><div className="p-4 sm:p-6">{children}</div>
            </div>
        </section>
    );
}

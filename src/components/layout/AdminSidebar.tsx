"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Tags,
  FileQuestion,
  FileText,
  BookOpen,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Categories", icon: Tags, exact: false },
  { href: "/admin/questions", label: "Questions", icon: FileQuestion, exact: false },
  { href: "/admin/papers", label: "Papers", icon: FileText, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-60 shrink-0 border-r border-border min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-3 mb-6">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
          <BookOpen className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm">PYQLab Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href, item.exact)
                ? "bg-indigo-50 text-indigo-700"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Back to site */}
      <Link
        href="/"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to site
      </Link>
    </aside>
  );
}
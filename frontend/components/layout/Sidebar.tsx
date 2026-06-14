"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Briefcase,
  Clock,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/applications",  label: "Applications", icon: Briefcase },
  { href: "/followups",     label: "Follow-ups",   icon: Clock },
  { href: "/resumes",       label: "Resumes",      icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-800">
        <h1 className="text-lg font-bold text-white">JobRover</h1>
        <p className="text-xs text-gray-500 mt-0.5">Application Tracker</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
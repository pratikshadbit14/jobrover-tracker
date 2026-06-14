"use client";

import { useOverdueFollowups } from "@/hooks/useFollowups";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function OverdueAlert() {
  const { data: overdue = [] } = useOverdueFollowups();

  if (overdue.length === 0) return null;

  return (
    <Link
      href="/followups"
      className="flex items-center gap-3 bg-red-900/20 border border-red-800/50 rounded-xl px-4 py-3 hover:bg-red-900/30 transition-colors"
    >
      <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
      <p className="text-sm text-red-200">
        You have <span className="font-semibold">{overdue.length}</span>{" "}
        overdue follow-up{overdue.length > 1 ? "s" : ""}. Click to review.
      </p>
    </Link>
  );
}
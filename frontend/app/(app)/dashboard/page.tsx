"use client";

import StatBar from "@/components/dashboard/StatBar";
import OverdueAlert from "@/components/dashboard/OverdueAlert";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import Button from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Your job search at a glance
          </p>
        </div>
        <Button onClick={() => router.push("/applications/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <OverdueAlert />
      <StatBar />

      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Pipeline</h2>
        <KanbanBoard />
      </div>
    </div>
  );
}
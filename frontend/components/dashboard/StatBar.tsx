"use client";

import { useApplications } from "@/hooks/useApplications";
import { useOverdueFollowups } from "@/hooks/useFollowups";
import Card from "@/components/ui/Card";
import { Briefcase, MessageSquare, Trophy, AlertCircle } from "lucide-react";

export default function StatBar() {
  const { data: applications = [] } = useApplications();
  const { data: overdue = [] } = useOverdueFollowups();

  const active = applications.filter(
    (a) => !["rejected", "withdrawn"].includes(a.status)
  ).length;

  const interviewing = applications.filter(
    (a) => a.status === "interviewing"
  ).length;

  const offers = applications.filter((a) => a.status === "offer").length;

  const stats = [
    {
      label: "Active applications",
      value: active,
      icon: Briefcase,
      color: "text-indigo-400 bg-indigo-600/10",
    },
    {
      label: "Interviewing",
      value: interviewing,
      icon: MessageSquare,
      color: "text-purple-400 bg-purple-600/10",
    },
    {
      label: "Offers",
      value: offers,
      icon: Trophy,
      color: "text-green-400 bg-green-600/10",
    },
    {
      label: "Overdue follow-ups",
      value: overdue.length,
      icon: AlertCircle,
      color: "text-red-400 bg-red-600/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
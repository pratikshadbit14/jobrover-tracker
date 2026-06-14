"use client";

import { useFollowups, useUpdateFollowup } from "@/hooks/useFollowups";
import { useApplications } from "@/hooks/useApplications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Followup } from "@/types";

const isOverdue = (dueDate: string) =>
  new Date(dueDate) < new Date(new Date().toDateString());

const isToday = (dueDate: string) =>
  new Date(dueDate).toDateString() === new Date().toDateString();

export default function FollowupsPage() {
  const { data: followups = [], isLoading } = useFollowups();
  const { data: applications = [] } = useApplications();
  const updateFollowup = useUpdateFollowup();

  const appMap = new Map(applications.map((a) => [a.id, a]));

  const pending = followups.filter((f) => f.status === "pending");
  const overdue = pending.filter((f) => isOverdue(f.due_date));
  const dueToday = pending.filter((f) => isToday(f.due_date));
  const upcoming = pending.filter(
    (f) => !isOverdue(f.due_date) && !isToday(f.due_date)
  );
  const resolved = followups.filter((f) => f.status !== "pending");

  const renderGroup = (title: string, items: Followup[], tone?: string) => {
    if (items.length === 0) return null;
    return (
      <div>
        <h2 className={`text-sm font-semibold mb-2 ${tone ?? "text-gray-300"}`}>
          {title} ({items.length})
        </h2>
        <div className="flex flex-col gap-2">
          {items.map((followup) => {
            const app = appMap.get(followup.application_id);
            return (
              <Card key={followup.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    {app ? (
                      <Link
                        href={`/applications/${app.id}`}
                        className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                      >
                        {app.job_title} — {app.company_name}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-white">
                        Application
                      </span>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Due {new Date(followup.due_date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short"
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateFollowup.mutate({ id: followup.id, body: { status: "sent" } })
                      }
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-colors px-2 py-1 rounded-lg hover:bg-green-900/20"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark sent
                    </button>
                    <button
                      onClick={() =>
                        updateFollowup.mutate({ id: followup.id, body: { status: "skipped" } })
                      }
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-gray-800"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Skip
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Follow-ups</h1>
        <p className="text-gray-400 text-sm mt-1">
          Stay on top of every application — follow-ups are auto-created 7
          days after you mark an application as applied.
        </p>
      </div>

      {pending.length === 0 ? (
        <Card className="text-center py-12">
          <CheckCircle2 className="h-8 w-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No pending follow-ups.</p>
          <p className="text-gray-500 text-sm mt-1">You&apos;re all caught up.</p>
        </Card>
      ) : (
        <>
          {renderGroup("Overdue", overdue, "text-red-400")}
          {renderGroup("Due today", dueToday, "text-yellow-400")}
          {renderGroup("Upcoming", upcoming, "text-gray-300")}
        </>
      )}

      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            Resolved ({resolved.length})
          </h2>
          <div className="flex flex-col gap-2 opacity-60">
            {resolved.map((followup) => {
              const app = appMap.get(followup.application_id);
              return (
                <Card key={followup.id}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {app ? `${app.job_title} — ${app.company_name}` : "Application"}
                    </span>
                    <Badge label={followup.status} status={followup.status} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
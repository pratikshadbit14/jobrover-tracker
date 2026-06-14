"use client";

import { useState } from "react";
import {
  useInterviews,
  useCreateInterview,
  useUpdateInterview,
  useDeleteInterview,
} from "@/hooks/useApplications";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { Plus, Trash2, Calendar } from "lucide-react";
import { Interview } from "@/types";

const ROUND_TYPES = [
  { value: "hr_screen",     label: "HR Screen" },
  { value: "technical",     label: "Technical" },
  { value: "system_design", label: "System Design" },
  { value: "assignment",    label: "Assignment" },
  { value: "cultural",      label: "Cultural Fit" },
  { value: "final",         label: "Final Round" },
  { value: "offer_call",    label: "Offer Call" },
];

const OUTCOMES = ["pending", "pass", "fail", "cancelled"];

export default function InterviewTimeline({ applicationId }: { applicationId: string }) {
  const { data: interviews = [], isLoading } = useInterviews(applicationId);
  const createInterview = useCreateInterview(applicationId);
  const updateInterview = useUpdateInterview(applicationId);
  const deleteInterview = useDeleteInterview(applicationId);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    round_type: "hr_screen",
    scheduled_at: "",
    interviewer: "",
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createInterview.mutate(
      {
        round_type: form.round_type,
        scheduled_at: form.scheduled_at || undefined,
        interviewer: form.interviewer || undefined,
      },
      {
        onSuccess: () => {
          setForm({ round_type: "hr_screen", scheduled_at: "", interviewer: "" });
          setShowForm(false);
        },
      }
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">Interview rounds</h3>
        <Button size="sm" variant="ghost" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add round
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-3 mb-4 p-3 bg-gray-950 rounded-lg border border-gray-800">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-400">Round type</label>
              <select
                value={form.round_type}
                onChange={(e) => setForm((f) => ({ ...f, round_type: e.target.value }))}
                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {ROUND_TYPES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Scheduled at"
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => setForm((f) => ({ ...f, scheduled_at: e.target.value }))}
            />
          </div>
          <Input
            label="Interviewer (optional)"
            placeholder="Name or panel"
            value={form.interviewer}
            onChange={(e) => setForm((f) => ({ ...f, interviewer: e.target.value }))}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={createInterview.isPending}>
              Save
            </Button>
            <Button type="button" size="sm" variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : interviews.length === 0 ? (
        <p className="text-sm text-gray-500">No interview rounds logged yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {interviews.map((interview: Interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">
                    {ROUND_TYPES.find((r) => r.value === interview.round_type)?.label ?? interview.round_type}
                  </span>
                  <Badge label={interview.outcome} status={interview.outcome} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  {interview.scheduled_at && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(interview.scheduled_at).toLocaleString("en-IN", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </span>
                  )}
                  {interview.interviewer && <span>{interview.interviewer}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={interview.outcome}
                  onChange={(e) =>
                    updateInterview.mutate({ id: interview.id, body: { outcome: e.target.value } })
                  }
                  className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {OUTCOMES.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <button
                  onClick={() => deleteInterview.mutate(interview.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
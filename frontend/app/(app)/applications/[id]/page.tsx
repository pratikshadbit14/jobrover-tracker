"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useApplication,
  useUpdateApplication,
  useDeleteApplication,
} from "@/hooks/useApplications";
import StatusPipeline from "@/components/applications/StatusPipeline";
import InterviewTimeline from "@/components/applications/InterviewTimeline";
import AIWorkspacePanel from "@/components/applications/AIWorkspacePanel";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Input";
import {
  ArrowLeft,
  MapPin,
  Globe,
  ExternalLink,
  Trash2,
  Save,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { ApplicationStatus } from "@/types";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: app, isLoading } = useApplication(id);
  const updateApplication = useUpdateApplication(id);
  const deleteApplication = useDeleteApplication();

  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!app) {
    return <p className="text-gray-400">Application not found.</p>;
  }

  const handleStatusChange = (status: ApplicationStatus) => {
    updateApplication.mutate({ status });
  };

  const handleDelete = () => {
    if (confirm("Delete this application? This cannot be undone.")) {
      deleteApplication.mutate(id, {
        onSuccess: () => router.push("/dashboard"),
      });
    }
  };

  const startEditingNotes = () => {
    setNotes(app.notes ?? "");
    setEditingNotes(true);
  };

  const saveNotes = () => {
    updateApplication.mutate(
      { notes },
      { onSuccess: () => setEditingNotes(false) }
    );
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{app.job_title}</h1>
            <p className="text-gray-400 mt-1">{app.company_name}</p>

            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
              {app.is_remote ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" /> Remote
                </span>
              ) : app.location ? (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {app.location}
                </span>
              ) : null}
              {app.source && <Badge label={app.source} />}
              {app.salary_expected && (
                <span>
                  Expected: ₹{Number(app.salary_expected).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-400 transition-colors p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status pipeline */}
      <Card>
        <StatusPipeline
          currentStatus={app.status as ApplicationStatus}
          onChange={handleStatusChange}
          disabled={updateApplication.isPending}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          {app.job_description && (
            <Card>
              <h3 className="text-sm font-semibold text-white mb-2">
                Job description
              </h3>
              <p className="text-sm text-gray-400 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {app.job_description}
              </p>
              {app.source_url && (
                <a
                  href={app.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-3"
                >
                  View original posting <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </Card>
          )}

          <InterviewTimeline applicationId={id} />

          <Card>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Notes</h3>
              {!editingNotes && (
                <button
                  onClick={startEditingNotes}
                  className="text-gray-500 hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {editingNotes ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveNotes}
                    loading={updateApplication.isPending}
                  >
                    <Save className="h-3.5 w-3.5 mr-1" /> Save
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setEditingNotes(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 whitespace-pre-wrap">
                {app.notes || "No notes yet."}
              </p>
            )}
          </Card>
        </div>

        {/* Right column — AI workspace */}
        <div className="flex flex-col gap-6">
          <AIWorkspacePanel />
        </div>
      </div>
    </div>
  );
}
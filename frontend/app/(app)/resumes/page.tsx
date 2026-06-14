"use client";

import { useState } from "react";
import {
  useResumes,
  useCreateResume,
  useSetDefaultResume,
  useDeleteResume,
} from "@/hooks/useResumes";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import Badge from "@/components/ui/Badge";
import { Plus, Trash2, Star, FileText } from "lucide-react";

export default function ResumesPage() {
  const { data: resumes = [], isLoading } = useResumes();
  const createResume = useCreateResume();
  const setDefault = useSetDefaultResume();
  const deleteResume = useDeleteResume();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", raw_text: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.raw_text) return;
    createResume.mutate(form, {
      onSuccess: () => {
        setForm({ label: "", raw_text: "" });
        setShowForm(false);
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Resumes</h1>
          <p className="text-gray-400 text-sm mt-1">
            Store different versions — the AI Resume Analyser will use the
            text of your default resume.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4 mr-2" />
          Add resume
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input
              label="Label"
              placeholder="e.g. SWE Resume v3, ML-focused resume"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              required
            />
            <Textarea
              label="Resume text"
              placeholder="Paste the full plain-text content of your resume here"
              rows={12}
              value={form.raw_text}
              onChange={(e) => setForm((f) => ({ ...f, raw_text: e.target.value }))}
              required
            />
            <div className="flex gap-2">
              <Button type="submit" loading={createResume.isPending}>
                Save resume
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-6 w-6" />
        </div>
      ) : resumes.length === 0 ? (
        <Card className="text-center py-12">
          <FileText className="h-8 w-8 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No resumes yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Add your first resume to get started.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-white">
                    {resume.label}
                  </span>
                  {resume.is_default && (
                    <Badge label="Default" status="offer" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!resume.is_default && (
                    <button
                      onClick={() => setDefault.mutate(resume.id)}
                      className="text-gray-500 hover:text-yellow-400 transition-colors"
                      title="Set as default"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Delete this resume?")) {
                        deleteResume.mutate(resume.id);
                      }
                    }}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Added {new Date(resume.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
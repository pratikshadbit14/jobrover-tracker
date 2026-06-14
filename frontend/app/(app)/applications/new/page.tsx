"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateApplication } from "@/hooks/useApplications";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const SOURCES = [
  { value: "linkedin",     label: "LinkedIn" },
  { value: "naukri",       label: "Naukri" },
  { value: "instahyre",    label: "Instahyre" },
  { value: "wellfound",    label: "Wellfound" },
  { value: "referral",     label: "Referral" },
  { value: "cold_apply",   label: "Cold Apply" },
  { value: "company_site", label: "Company Site" },
  { value: "other",        label: "Other" },
];

export default function NewApplicationPage() {
  const router = useRouter();
  const createApplication = useCreateApplication();

  const [form, setForm] = useState({
    job_title: "",
    company_name: "",
    job_description: "",
    source: "",
    source_url: "",
    applied_date: "",
    location: "",
    is_remote: false,
    salary_expected: "",
    notes: "",
  });

  const set = (key: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (createApplication.isPending) return;

    const payload: Record<string, unknown> = {
      job_title: form.job_title,
      company_name: form.company_name,
      job_description: form.job_description || undefined,
      source: form.source || undefined,
      source_url: form.source_url || undefined,
      applied_date: form.applied_date || undefined,
      location: form.location || undefined,
      is_remote: form.is_remote,
      salary_expected: form.salary_expected
        ? parseFloat(form.salary_expected)
        : undefined,
      notes: form.notes || undefined,
    };

    createApplication.mutate(payload, {
      onSuccess: (data) => {
        router.push(`/applications/${data.id}`);
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-white mb-1">New Application</h1>
      <p className="text-gray-400 text-sm mb-6">
        Track a job you&apos;ve applied to or are planning to apply to
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Job title *"
            placeholder="Software Engineer"
            value={form.job_title}
            onChange={set("job_title")}
            required
          />
          <Input
            label="Company *"
            placeholder="Anthropic"
            value={form.company_name}
            onChange={set("company_name")}
            required
          />
        </div>

        <Textarea
          label="Job description"
          placeholder="Paste the full JD here — this will be used for AI tailoring later"
          rows={6}
          value={form.job_description}
          onChange={set("job_description")}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Source</label>
            <select
              value={form.source}
              onChange={set("source") as unknown as React.ChangeEventHandler<HTMLSelectElement>}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select source</option>
              {SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Source URL"
            placeholder="https://..."
            value={form.source_url}
            onChange={set("source_url")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Applied date"
            type="date"
            value={form.applied_date}
            onChange={set("applied_date")}
          />
          <Input
            label="Expected salary (₹)"
            type="number"
            placeholder="1200000"
            value={form.salary_expected}
            onChange={set("salary_expected")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 items-end">
          <Input
            label="Location"
            placeholder="Bangalore, India"
            value={form.location}
            onChange={set("location")}
            disabled={form.is_remote}
          />
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_remote}
              onChange={set("is_remote")}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-300">This role is remote</span>
          </label>
        </div>

        <Textarea
          label="Notes"
          placeholder="Anything else worth remembering about this application"
          rows={3}
          value={form.notes}
          onChange={set("notes")}
        />

        {createApplication.isError && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            Failed to create application. Please try again.
          </p>
        )}

        <div className="flex gap-3 mt-2">
          <Button
            type="submit"
            loading={createApplication.isPending}
            className="flex-1"
            size="lg"
          >
            Create Application
          </Button>
          <Link href="/dashboard">
            <Button type="button" variant="secondary" size="lg">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
"use client";

import { Application } from "@/types";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MapPin, Globe } from "lucide-react";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const daysSince = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export default function KanbanCard({ application }: { application: Application }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: application.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        onClick={() => router.push(`/applications/${application.id}`)}
        className="cursor-grab active:cursor-grabbing hover:border-indigo-600/40"
      >
        <p className="text-sm font-semibold text-white truncate">
          {application.job_title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 truncate">
          {application.company_name}
        </p>

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          {application.is_remote ? (
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" /> Remote
            </span>
          ) : application.location ? (
            <span className="flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3" /> {application.location}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
          <span className="text-xs text-gray-500">
            {application.applied_date
              ? `Applied ${formatDate(application.applied_date)}`
              : "Not yet applied"}
          </span>
          {application.applied_date && (
            <span className="text-xs text-gray-500">
              {daysSince(application.applied_date)}d
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
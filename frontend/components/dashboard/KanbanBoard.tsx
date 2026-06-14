"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useApplications, useUpdateApplicationStatus } from "@/hooks/useApplications";
import { Application, ApplicationStatus } from "@/types";
import KanbanCard from "./KanbanCard";
import Spinner from "@/components/ui/Spinner";

const COLUMNS: { id: ApplicationStatus; label: string; color: string }[] = [
  { id: "saved",        label: "Saved",        color: "border-gray-700" },
  { id: "applied",      label: "Applied",      color: "border-blue-700" },
  { id: "screened",     label: "Screened",     color: "border-yellow-700" },
  { id: "interviewing", label: "Interviewing", color: "border-purple-700" },
  { id: "offer",        label: "Offer",        color: "border-green-700" },
  { id: "rejected",     label: "Rejected",     color: "border-red-700" },
];

function Column({
  id,
  label,
  color,
  applications,
}: {
  id: ApplicationStatus;
  label: string;
  color: string;
  applications: Application[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] flex flex-col bg-gray-900/50 rounded-xl border-t-2 ${color} ${
        isOver ? "bg-gray-800/50" : ""
      }`}
    >
      <div className="px-3 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">{label}</h3>
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
          {applications.length}
        </span>
      </div>
      <SortableContext
        items={applications.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 px-3 pb-3 min-h-[100px]">
          {applications.map((app) => (
            <KanbanCard key={app.id} application={app} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard() {
  const { data: applications = [], isLoading } = useApplications();
  const updateStatus = useUpdateApplicationStatus();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const grouped = useMemo(() => {
    const groups: Record<string, Application[]> = {};
    COLUMNS.forEach((col) => (groups[col.id] = []));
    applications.forEach((app) => {
      if (groups[app.status]) groups[app.status].push(app);
    });
    return groups;
  }, [applications]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const appId = active.id as string;
    const newStatus = over.id as ApplicationStatus;
    const app = applications.find((a) => a.id === appId);

    if (!app || app.status === newStatus) return;
    if (!COLUMNS.find((c) => c.id === newStatus)) return;

    updateStatus.mutate({ id: appId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            label={col.label}
            color={col.color}
            applications={grouped[col.id]}
          />
        ))}
      </div>
    </DndContext>
  );
}
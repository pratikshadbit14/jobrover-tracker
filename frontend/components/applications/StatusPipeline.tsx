"use client";

import { clsx } from "clsx";
import { ApplicationStatus } from "@/types";
import { Check } from "lucide-react";

const STAGES: { id: ApplicationStatus; label: string }[] = [
  { id: "saved",        label: "Saved" },
  { id: "applied",      label: "Applied" },
  { id: "screened",     label: "Screened" },
  { id: "interviewing", label: "Interviewing" },
  { id: "offer",        label: "Offer" },
];

const TERMINAL: ApplicationStatus[] = ["rejected", "withdrawn"];

interface Props {
  currentStatus: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
  disabled?: boolean;
}

export default function StatusPipeline({ currentStatus, onChange, disabled }: Props) {
  const isTerminal = TERMINAL.includes(currentStatus);
  const currentIndex = STAGES.findIndex((s) => s.id === currentStatus);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center">
        {STAGES.map((stage, i) => {
          const isDone   = !isTerminal && i < currentIndex;
          const isActive = !isTerminal && i === currentIndex;
          const isFuture = isTerminal || i > currentIndex;

          return (
            <div key={stage.id} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(stage.id)}
                className={clsx(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
                  isDone && "bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30",
                  isActive && "bg-indigo-600 text-white",
                  isFuture && "bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300",
                  disabled && "cursor-not-allowed opacity-60"
                )}
              >
                {isDone && <Check className="h-3 w-3" />}
                {stage.label}
              </button>
              {i < STAGES.length - 1 && (
                <div
                  className={clsx(
                    "flex-1 h-0.5 mx-1",
                    isDone ? "bg-indigo-600/40" : "bg-gray-800"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {isTerminal && (
        <div>
          <span
            className={clsx(
              "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium",
              currentStatus === "rejected"
                ? "bg-red-900/30 text-red-300"
                : "bg-gray-800 text-gray-400"
            )}
          >
            {currentStatus === "rejected" ? "Rejected" : "Withdrawn"}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        {!isTerminal && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("withdrawn")}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Mark as withdrawn
          </button>
        )}
        {!isTerminal && currentStatus !== "saved" && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("rejected")}
            className="text-xs text-gray-500 hover:text-red-400 transition-colors"
          >
            Mark as rejected
          </button>
        )}
        {isTerminal && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => onChange("applied")}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Reopen application
          </button>
        )}
      </div>
    </div>
  );
}
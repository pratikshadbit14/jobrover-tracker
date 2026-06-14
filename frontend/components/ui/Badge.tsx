import { clsx } from "clsx";

const statusStyles: Record<string, string> = {
  saved:        "bg-gray-800 text-gray-300",
  applied:      "bg-blue-900/50 text-blue-300",
  screened:     "bg-yellow-900/50 text-yellow-300",
  interviewing: "bg-purple-900/50 text-purple-300",
  offer:        "bg-green-900/50 text-green-300",
  rejected:     "bg-red-900/50 text-red-300",
  withdrawn:    "bg-gray-800 text-gray-400",
  pending:      "bg-yellow-900/50 text-yellow-300",
  sent:         "bg-green-900/50 text-green-300",
  skipped:      "bg-gray-800 text-gray-400",
  pass:         "bg-green-900/50 text-green-300",
  fail:         "bg-red-900/50 text-red-300",
};

interface BadgeProps {
  label: string;
  status?: string;
  className?: string;
}

export default function Badge({ label, status, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        status ? statusStyles[status] ?? "bg-gray-800 text-gray-300" : "bg-gray-800 text-gray-300",
        className
      )}
    >
      {label}
    </span>
  );
}
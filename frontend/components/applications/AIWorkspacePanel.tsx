"use client";

import Card from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

export default function AIWorkspacePanel() {
  return (
    <Card className="border-dashed">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">AI Workspace</h3>
          <p className="text-sm text-gray-500 mt-1">
            Resume tailoring, cover letter generation, and rejection analysis
            will appear here once the AI Resume Analyser (P3) is connected.
          </p>
        </div>
      </div>
    </Card>
  );
}
"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useReportStore } from "@/stores/report-store";

interface ReportEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Inner component remounts each time the modal opens, so draft starts fresh.
function ReportEditorContent({ onClose }: { onClose: () => void }) {
  const contentHtml = useReportStore((s) => s.contentHtml);
  const setContentHtml = useReportStore((s) => s.setContentHtml);

  const [draft, setDraft] = useState(contentHtml);

  const handleSave = () => {
    setContentHtml(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">编辑报告</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="在此编辑报告 HTML 内容..."
            className="h-full min-h-[400px] w-full rounded-md border border-gray-300 px-4 py-3 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export function ReportEditor({ isOpen, onClose }: ReportEditorProps) {
  if (!isOpen) return null;
  return <ReportEditorContent onClose={onClose} />;
}

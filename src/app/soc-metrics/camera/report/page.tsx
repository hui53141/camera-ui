"use client";

import { useState } from "react";
import { Edit, Download, Eye, Send, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { EmailForm } from "@/components/report/EmailForm";
import { ReportEditor } from "@/components/report/ReportEditor";
import { DataImporter } from "@/components/report/DataImporter";
import { ReportPreview } from "@/components/report/ReportPreview";
import {
  useReportStore,
  type ImportedDataItem,
} from "@/stores/report-store";

function SortableCard({
  item,
  onRemove,
}: {
  item: ImportedDataItem;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dataCount =
    item.chartData.length > 0
      ? `${item.chartData.length} 个数据点`
      : `${item.tableData.length} 行数据`;

  const typeLabel = item.chartData.length > 0 ? "趋势图" : "数据表";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-0.5 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
              {item.metricType}
            </span>
            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {typeLabel}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-800 truncate">
            {item.title}
          </p>
          <p className="text-xs text-gray-400 mt-1">{dataCount}</p>
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function ReportPage() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [importerOpen, setImporterOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const importedData = useReportStore((s) => s.importedData);
  const removeImportedData = useReportStore((s) => s.removeImportedData);
  const reorderImportedData = useReportStore((s) => s.reorderImportedData);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = importedData.findIndex((d) => d.id === active.id);
    const newIndex = importedData.findIndex((d) => d.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderImportedData(oldIndex, newIndex);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await fetch("/api/report/send", { method: "POST" });
    } finally {
      setSending(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">报告发送</h1>
        <p className="mt-1 text-sm text-gray-500">
          配置邮件信息、编辑报告内容并引入度量数据，完成后一键发送报告
        </p>
      </div>

      {/* Rows 1-4: EmailForm */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <EmailForm />
      </div>

      {/* Row 5: Action buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Edit className="h-4 w-4" />
          编辑报告
        </button>
        <button
          type="button"
          onClick={() => setImporterOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          引入数据
        </button>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Eye className="h-4 w-4" />
          预览报告
        </button>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
          一键发送
        </button>
      </div>

      {/* Row 6: Imported data content */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          引入数据内容
        </h2>

        {importedData.length === 0 ? (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16">
            <p className="text-sm text-gray-400">
              暂无引入数据，请点击&ldquo;引入数据&rdquo;按钮添加
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={importedData.map((d) => d.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {importedData.map((item) => (
                  <SortableCard
                    key={item.id}
                    item={item}
                    onRemove={removeImportedData}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      <ReportEditor
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
      />
      <DataImporter
        isOpen={importerOpen}
        onClose={() => setImporterOpen(false)}
      />
      <ReportPreview
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />

      {/* Send confirmation dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">确认发送</h3>
            <p className="mt-2 text-sm text-gray-500">
              确定要发送此报告吗？发送后将通过邮件通知所有相关人员。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={sending}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? "发送中…" : "确认发送"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

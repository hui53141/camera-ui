"use client";

import { X, BarChart3, Table } from "lucide-react";
import { useReportStore } from "@/stores/report-store";

interface ReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportPreview({ isOpen, onClose }: ReportPreviewProps) {
  const subject = useReportStore((s) => s.subject);
  const versionInfo = useReportStore((s) => s.versionInfo);
  const topIssues = useReportStore((s) => s.topIssues);
  const importedData = useReportStore((s) => s.importedData);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">报告预览</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* Subject */}
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {subject || "（未填写主题）"}
            </h3>
          </div>

          {/* Version Info */}
          <section>
            <h4 className="text-sm font-semibold text-gray-500 mb-3">
              验证版本信息
            </h4>
            <div className="rounded-md border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="bg-gray-50 px-4 py-2 font-medium text-gray-600 w-40">
                      平台
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {versionInfo.platform || "—"}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="bg-gray-50 px-4 py-2 font-medium text-gray-600">
                      产品
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {versionInfo.product || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-gray-50 px-4 py-2 font-medium text-gray-600">
                      最近一次测试版本
                    </td>
                    <td className="px-4 py-2 text-gray-900">
                      {versionInfo.version || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Issues */}
          {topIssues && (
            <section>
              <h4 className="text-sm font-semibold text-gray-500 mb-3">
                Top问题
              </h4>
              <div className="whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                {topIssues}
              </div>
            </section>
          )}

          {/* Imported Data */}
          {importedData.length > 0 && (
            <section>
              <h4 className="text-sm font-semibold text-gray-500 mb-3">
                度量数据
              </h4>
              <div className="space-y-4">
                {importedData.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-gray-200 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {item.chartData.length > 0 ? (
                        <BarChart3 className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Table className="h-4 w-4 text-green-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {item.title}
                      </span>
                      <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {item.metricType}
                      </span>
                    </div>

                    {item.chartData.length > 0 && (
                      <div className="flex h-32 items-center justify-center rounded bg-gray-50 text-sm text-gray-400">
                        图表占位 — {item.chartData.length} 个数据点
                      </div>
                    )}
                    {item.tableData.length > 0 && (
                      <div className="flex h-24 items-center justify-center rounded bg-gray-50 text-sm text-gray-400">
                        数据表占位 — {item.tableData.length} 行数据
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

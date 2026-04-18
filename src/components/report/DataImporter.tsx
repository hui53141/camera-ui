"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useReportStore } from "@/stores/report-store";

interface DataImporterProps {
  isOpen: boolean;
  onClose: () => void;
}

const METRIC_TYPES = [
  "启动专项",
  "切换专项",
  "帧率帧间隔",
  "静态内存",
  "峰值内存",
] as const;

function makeMockData(metricType: string, kind: "chart" | "table") {
  if (kind === "chart") {
    return Array.from({ length: 7 }, (_, i) => ({
      date: `2024-01-0${i + 1}`,
      value: Math.round(Math.random() * 100),
    }));
  }
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    metric: metricType,
    result: Math.round(Math.random() * 100),
    baseline: 50,
  }));
}

export function DataImporter({ isOpen, onClose }: DataImporterProps) {
  const addImportedData = useReportStore((s) => s.addImportedData);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleExpand = (type: string) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleSelect = (key: string) => {
    setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirm = () => {
    for (const type of METRIC_TYPES) {
      const chartKey = `${type}-chart`;
      const tableKey = `${type}-table`;

      if (selected[chartKey]) {
        addImportedData({
          id: crypto.randomUUID(),
          metricType: type,
          title: `${type} 趋势图`,
          chartData: makeMockData(type, "chart"),
          tableData: [],
        });
      }
      if (selected[tableKey]) {
        addImportedData({
          id: crypto.randomUUID(),
          metricType: type,
          title: `${type} 数据表`,
          chartData: [],
          tableData: makeMockData(type, "table"),
        });
      }
    }

    setSelected({});
    onClose();
  };

  const handleCancel = () => {
    setSelected({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            引入Camera度量数据
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-2">
          {METRIC_TYPES.map((type) => {
            const isExpanded = !!expanded[type];
            const chartKey = `${type}-chart`;
            const tableKey = `${type}-table`;

            return (
              <div key={type} className="rounded-md border border-gray-200">
                <button
                  type="button"
                  onClick={() => toggleExpand(type)}
                  className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  {type}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-3">
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selected[chartKey]}
                        onChange={() => toggleSelect(chartKey)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {type} 趋势图
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selected[tableKey]}
                        onChange={() => toggleSelect(tableKey)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {type} 数据表
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            确认引入
          </button>
        </div>
      </div>
    </div>
  );
}

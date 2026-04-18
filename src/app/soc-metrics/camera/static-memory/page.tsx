"use client";

import { MetricsPage } from "@/components/metrics/MetricsPage";
import { generateSeedData } from "@/lib/seed-data";

const { records, values } = generateSeedData();

const metricRecords = records
  .map((r, i) => ({ ...r, index: i }))
  .filter((r) => r.metricType === "static_memory");

const metricValues = values.filter((v) =>
  metricRecords.some((r) => r.index === v.recordIndex)
);

const chartData = metricRecords.map((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const avg = (name: string) => {
    const arr = recordValues.filter((v) => v.metricName === name);
    return arr.length
      ? Math.round((arr.reduce((s, v) => s + v.value, 0) / arr.length) * 100) /
          100
      : 0;
  };
  return {
    version: record.version,
    camera_process: avg("camera_process"),
    hal_memory: avg("hal_memory"),
    total_memory: avg("total_memory"),
  };
});

const tableData = metricRecords.flatMap((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const scenes = [...new Set(recordValues.map((v) => v.sceneName))];
  return scenes.map((scene) => {
    const sceneValues = recordValues.filter((v) => v.sceneName === scene);
    const cam = sceneValues.find((v) => v.metricName === "camera_process");
    const hal = sceneValues.find((v) => v.metricName === "hal_memory");
    const total = sceneValues.find((v) => v.metricName === "total_memory");
    return {
      version: record.version,
      sceneName: scene,
      camera_process: cam?.value ?? 0,
      hal_memory: hal?.value ?? 0,
      total_memory: total?.value ?? 0,
      baseline: total?.baseline ?? 0,
      threshold: total?.threshold ?? 0,
    };
  });
});

const chartConfig = {
  xKey: "version",
  yKeys: [
    { key: "camera_process", label: "Camera进程", color: "#3b82f6" },
    { key: "hal_memory", label: "HAL内存", color: "#8b5cf6" },
    { key: "total_memory", label: "总内存", color: "#ef4444" },
  ],
  chartType: "area" as const,
  thresholdLines: [
    { value: 300, label: "总内存阈值 300MB", color: "#ef4444" },
  ],
};

const tableColumns = [
  { key: "version", label: "版本" },
  { key: "sceneName", label: "场景" },
  {
    key: "camera_process",
    label: "Camera进程",
    unit: "MB",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  {
    key: "hal_memory",
    label: "HAL内存",
    unit: "MB",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  {
    key: "total_memory",
    label: "总内存",
    unit: "MB",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  { key: "baseline", label: "基线" },
  { key: "threshold", label: "阈值" },
];

export default function StaticMemoryPage() {
  return (
    <MetricsPage
      title="静态内存"
      description="Camera进程静态内存占用度量数据"
      chartData={chartData}
      tableData={tableData}
      chartConfig={chartConfig}
      tableColumns={tableColumns}
    />
  );
}

"use client";

import { MetricsPage } from "@/components/metrics/MetricsPage";
import { generateSeedData } from "@/lib/seed-data";

const { records, values } = generateSeedData();

const metricRecords = records
  .map((r, i) => ({ ...r, index: i }))
  .filter((r) => r.metricType === "frame_rate");

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
    preview_fps: avg("preview_fps"),
    capture_fps: avg("capture_fps"),
  };
});

const tableData = metricRecords.flatMap((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const scenes = [...new Set(recordValues.map((v) => v.sceneName))];
  return scenes.map((scene) => {
    const sceneValues = recordValues.filter((v) => v.sceneName === scene);
    const preview = sceneValues.find((v) => v.metricName === "preview_fps");
    const capture = sceneValues.find((v) => v.metricName === "capture_fps");
    const interval = sceneValues.find(
      (v) => v.metricName === "frame_interval"
    );
    return {
      version: record.version,
      sceneName: scene,
      preview_fps: preview?.value ?? 0,
      capture_fps: capture?.value ?? 0,
      frame_interval: interval?.value ?? 0,
      baseline: preview?.baseline ?? 0,
      threshold: preview?.threshold ?? 0,
    };
  });
});

const chartConfig = {
  xKey: "version",
  yKeys: [
    { key: "preview_fps", label: "预览帧率", color: "#3b82f6" },
    { key: "capture_fps", label: "拍摄帧率", color: "#22c55e" },
  ],
  chartType: "line" as const,
  thresholdLines: [
    { value: 25, label: "帧率阈值 25fps", color: "#ef4444" },
  ],
};

const tableColumns = [
  { key: "version", label: "版本" },
  { key: "sceneName", label: "场景" },
  {
    key: "preview_fps",
    label: "预览帧率",
    unit: "fps",
    highlightRules: [
      { condition: "< threshold", color: "#ef4444", ruleName: "低于阈值" },
      { condition: "< baseline * 0.9", color: "#f97316", ruleName: "劣化" },
    ],
    baselineKey: "baseline",
    thresholdKey: "threshold",
  },
  {
    key: "capture_fps",
    label: "拍摄帧率",
    unit: "fps",
    highlightRules: [
      { condition: "< threshold", color: "#ef4444", ruleName: "低于阈值" },
      { condition: "< baseline * 0.9", color: "#f97316", ruleName: "劣化" },
    ],
    baselineKey: "baseline",
    thresholdKey: "threshold",
  },
  { key: "frame_interval", label: "帧间隔", unit: "ms" },
  { key: "baseline", label: "基线" },
  { key: "threshold", label: "阈值" },
];

export default function FrameRatePage() {
  return (
    <MetricsPage
      title="帧率帧间隔"
      description="Camera预览和拍摄帧率、帧间隔度量数据"
      chartData={chartData}
      tableData={tableData}
      chartConfig={chartConfig}
      tableColumns={tableColumns}
    />
  );
}

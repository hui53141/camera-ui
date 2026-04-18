"use client";

import { MetricsPage } from "@/components/metrics/MetricsPage";
import { generateSeedData } from "@/lib/seed-data";

const { records, values } = generateSeedData();

const metricRecords = records
  .map((r, i) => ({ ...r, index: i }))
  .filter((r) => r.metricType === "peak_memory");

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
    capture_peak: avg("capture_peak"),
    video_peak: avg("video_peak"),
    burst_peak: avg("burst_peak"),
  };
});

const tableData = metricRecords.flatMap((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const scenes = [...new Set(recordValues.map((v) => v.sceneName))];
  return scenes.map((scene) => {
    const sceneValues = recordValues.filter((v) => v.sceneName === scene);
    const capture = sceneValues.find((v) => v.metricName === "capture_peak");
    const video = sceneValues.find((v) => v.metricName === "video_peak");
    const burst = sceneValues.find((v) => v.metricName === "burst_peak");
    return {
      version: record.version,
      sceneName: scene,
      capture_peak: capture?.value ?? 0,
      video_peak: video?.value ?? 0,
      burst_peak: burst?.value ?? 0,
      baseline: capture?.baseline ?? 0,
      threshold: capture?.threshold ?? 0,
    };
  });
});

const chartConfig = {
  xKey: "version",
  yKeys: [
    { key: "capture_peak", label: "拍照峰值", color: "#3b82f6" },
    { key: "video_peak", label: "录像峰值", color: "#8b5cf6" },
    { key: "burst_peak", label: "连拍峰值", color: "#ef4444" },
  ],
  chartType: "bar" as const,
  thresholdLines: [
    { value: 450, label: "峰值阈值 450MB", color: "#ef4444" },
  ],
};

const tableColumns = [
  { key: "version", label: "版本" },
  { key: "sceneName", label: "场景" },
  {
    key: "capture_peak",
    label: "拍照峰值",
    unit: "MB",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
      { condition: "> baseline * 1.3", color: "#f97316", ruleName: "劣化" },
    ],
    baselineKey: "baseline",
    thresholdKey: "threshold",
  },
  {
    key: "video_peak",
    label: "录像峰值",
    unit: "MB",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
      { condition: "> baseline * 1.3", color: "#f97316", ruleName: "劣化" },
    ],
    baselineKey: "baseline",
    thresholdKey: "threshold",
  },
  {
    key: "burst_peak",
    label: "连拍峰值",
    unit: "MB",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
      { condition: "> baseline * 1.3", color: "#f97316", ruleName: "劣化" },
    ],
    baselineKey: "baseline",
    thresholdKey: "threshold",
  },
  { key: "baseline", label: "基线" },
  { key: "threshold", label: "阈值" },
];

export default function PeakMemoryPage() {
  return (
    <MetricsPage
      title="峰值内存"
      description="Camera拍照和录像峰值内存占用度量数据"
      chartData={chartData}
      tableData={tableData}
      chartConfig={chartConfig}
      tableColumns={tableColumns}
    />
  );
}

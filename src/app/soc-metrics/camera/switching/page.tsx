"use client";

import { MetricsPage } from "@/components/metrics/MetricsPage";
import { generateSeedData } from "@/lib/seed-data";

const { records, values } = generateSeedData();

const metricRecords = records
  .map((r, i) => ({ ...r, index: i }))
  .filter((r) => r.metricType === "switching");

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
    front_to_rear: avg("front_to_rear"),
    rear_to_front: avg("rear_to_front"),
    mode_switch: avg("mode_switch"),
  };
});

const tableData = metricRecords.flatMap((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const scenes = [...new Set(recordValues.map((v) => v.sceneName))];
  return scenes.map((scene) => {
    const sceneValues = recordValues.filter((v) => v.sceneName === scene);
    const ftr = sceneValues.find((v) => v.metricName === "front_to_rear");
    const rtf = sceneValues.find((v) => v.metricName === "rear_to_front");
    const ms = sceneValues.find((v) => v.metricName === "mode_switch");
    return {
      version: record.version,
      sceneName: scene,
      front_to_rear: ftr?.value ?? 0,
      rear_to_front: rtf?.value ?? 0,
      mode_switch: ms?.value ?? 0,
      baseline: ftr?.baseline ?? 0,
      threshold: ftr?.threshold ?? 0,
    };
  });
});

const chartConfig = {
  xKey: "version",
  yKeys: [
    { key: "front_to_rear", label: "前→后切换", color: "#3b82f6" },
    { key: "rear_to_front", label: "后→前切换", color: "#8b5cf6" },
    { key: "mode_switch", label: "模式切换", color: "#f59e0b" },
  ],
  chartType: "bar" as const,
  thresholdLines: [
    { value: 600, label: "阈值 600ms", color: "#ef4444" },
  ],
};

const tableColumns = [
  { key: "version", label: "版本" },
  { key: "sceneName", label: "场景" },
  {
    key: "front_to_rear",
    label: "前→后切换",
    unit: "ms",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  {
    key: "rear_to_front",
    label: "后→前切换",
    unit: "ms",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  {
    key: "mode_switch",
    label: "模式切换",
    unit: "ms",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  { key: "baseline", label: "基线" },
  { key: "threshold", label: "阈值" },
];

export default function SwitchingPage() {
  return (
    <MetricsPage
      title="切换专项"
      description="Camera前后置切换及模式切换时间度量"
      chartData={chartData}
      tableData={tableData}
      chartConfig={chartConfig}
      tableColumns={tableColumns}
    />
  );
}

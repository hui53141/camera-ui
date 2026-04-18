"use client";

import { MetricsPage } from "@/components/metrics/MetricsPage";
import { generateSeedData } from "@/lib/seed-data";

const { records, values } = generateSeedData();

const metricRecords = records
  .map((r, i) => ({ ...r, index: i }))
  .filter((r) => r.metricType === "startup");

const metricValues = values.filter((v) =>
  metricRecords.some((r) => r.index === v.recordIndex)
);

// Chart data: average metric values grouped by version
const chartData = metricRecords.map((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const coldValues = recordValues.filter(
    (v) => v.metricName === "cold_start_time"
  );
  const hotValues = recordValues.filter(
    (v) => v.metricName === "hot_start_time"
  );
  const avg = (arr: typeof coldValues) =>
    arr.length
      ? Math.round((arr.reduce((s, v) => s + v.value, 0) / arr.length) * 100) /
        100
      : 0;
  return {
    version: record.version,
    cold_start_time: avg(coldValues),
    hot_start_time: avg(hotValues),
  };
});

// Table data: one row per scene per version
const tableData = metricRecords.flatMap((record) => {
  const recordValues = metricValues.filter(
    (v) => v.recordIndex === record.index
  );
  const scenes = [...new Set(recordValues.map((v) => v.sceneName))];
  return scenes.map((scene) => {
    const sceneValues = recordValues.filter((v) => v.sceneName === scene);
    const cold = sceneValues.find((v) => v.metricName === "cold_start_time");
    const hot = sceneValues.find((v) => v.metricName === "hot_start_time");
    return {
      version: record.version,
      sceneName: scene,
      cold_start_time: cold?.value ?? 0,
      hot_start_time: hot?.value ?? 0,
      baseline: cold?.baseline ?? 0,
      threshold: cold?.threshold ?? 0,
    };
  });
});

const chartConfig = {
  xKey: "version",
  yKeys: [
    { key: "cold_start_time", label: "冷启动时间", color: "#3b82f6" },
    { key: "hot_start_time", label: "热启动时间", color: "#22c55e" },
  ],
  chartType: "bar" as const,
  thresholdLines: [
    { value: 1500, label: "冷启动阈值 1500ms", color: "#ef4444" },
  ],
};

const tableColumns = [
  { key: "version", label: "版本" },
  { key: "sceneName", label: "场景" },
  {
    key: "cold_start_time",
    label: "冷启动时间",
    unit: "ms",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
      { condition: "> baseline * 1.2", color: "#f97316", ruleName: "劣化" },
    ],
    baselineKey: "baseline",
    thresholdKey: "threshold",
  },
  {
    key: "hot_start_time",
    label: "热启动时间",
    unit: "ms",
    highlightRules: [
      { condition: "> threshold", color: "#ef4444", ruleName: "超阈值" },
    ],
    thresholdKey: "threshold",
  },
  { key: "baseline", label: "基线" },
  { key: "threshold", label: "阈值" },
];

export default function StartupPage() {
  return (
    <MetricsPage
      title="启动专项"
      description="Camera启动时间度量数据，包含冷启动和热启动时间"
      chartData={chartData}
      tableData={tableData}
      chartConfig={chartConfig}
      tableColumns={tableColumns}
    />
  );
}

"use client";

import { MetricsChart } from "./MetricsChart";
import { MetricsTable } from "./MetricsTable";

interface MetricsPageProps {
  title: string;
  description: string;
  chartData: Array<Record<string, unknown>>;
  tableData: Array<Record<string, unknown>>;
  chartConfig: {
    xKey: string;
    yKeys: Array<{ key: string; label: string; color: string }>;
    chartType: "line" | "bar" | "area";
    thresholdLines?: Array<{ value: number; label: string; color: string }>;
  };
  tableColumns: Array<{
    key: string;
    label: string;
    unit?: string;
    highlightRules?: Array<{ condition: string; color: string; ruleName: string }>;
    baselineKey?: string;
    thresholdKey?: string;
  }>;
}

export function MetricsPage({
  title,
  description,
  chartData,
  tableData,
  chartConfig,
  tableColumns,
}: MetricsPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <MetricsChart
        data={chartData}
        xKey={chartConfig.xKey}
        yKeys={chartConfig.yKeys}
        title={title}
        chartType={chartConfig.chartType}
        thresholdLines={chartConfig.thresholdLines}
      />

      <MetricsTable data={tableData} columns={tableColumns} title={title} />
    </div>
  );
}

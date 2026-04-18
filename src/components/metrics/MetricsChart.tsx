"use client";

import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

interface YKeyConfig {
  key: string;
  label: string;
  color: string;
}

interface ThresholdLine {
  value: number;
  label: string;
  color: string;
}

interface MetricsChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKeys: YKeyConfig[];
  title: string;
  chartType?: "line" | "bar" | "area";
  xLabel?: string;
  yLabel?: string;
  thresholdLines?: ThresholdLine[];
}

export function MetricsChart({
  data,
  xKey,
  yKeys,
  title,
  chartType = "line",
  xLabel,
  yLabel,
  thresholdLines,
}: MetricsChartProps) {
  const commonChildren = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis
        dataKey={xKey}
        tick={{ fontSize: 12, fill: "#6b7280" }}
        label={
          xLabel
            ? { value: xLabel, position: "insideBottom", offset: -4, fontSize: 12 }
            : undefined
        }
      />
      <YAxis
        tick={{ fontSize: 12, fill: "#6b7280" }}
        label={
          yLabel
            ? { value: yLabel, angle: -90, position: "insideLeft", fontSize: 12 }
            : undefined
        }
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          fontSize: 13,
        }}
      />
      <Legend wrapperStyle={{ fontSize: 13 }} />
      {thresholdLines?.map((line) => (
        <ReferenceLine
          key={line.label}
          y={line.value}
          stroke={line.color}
          strokeDasharray="6 4"
          label={{
            value: line.label,
            position: "right",
            fill: line.color,
            fontSize: 11,
          }}
        />
      ))}
    </>
  );

  const chartMargin = { top: 16, right: 24, bottom: 16, left: 16 };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data} margin={chartMargin}>
            {commonChildren}
            {yKeys.map((yk) => (
              <Bar
                key={yk.key}
                dataKey={yk.key}
                name={yk.label}
                fill={yk.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      case "area":
        return (
          <AreaChart data={data} margin={chartMargin}>
            {commonChildren}
            {yKeys.map((yk) => (
              <Area
                key={yk.key}
                dataKey={yk.key}
                name={yk.label}
                stroke={yk.color}
                fill={yk.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
      default:
        return (
          <LineChart data={data} margin={chartMargin}>
            {commonChildren}
            {yKeys.map((yk) => (
              <Line
                key={yk.key}
                type="monotone"
                dataKey={yk.key}
                name={yk.label}
                stroke={yk.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-base font-semibold text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { generateSeedData } from '@/lib/seed-data';

const VALID_TYPES = [
  'startup',
  'switching',
  'frame_rate',
  'static_memory',
  'peak_memory',
] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || 'startup';

    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      return NextResponse.json(
        { error: `Invalid metric type. Must be one of: ${VALID_TYPES.join(', ')}` },
        { status: 400 },
      );
    }

    const { records, values } = generateSeedData();

    const filtered = records
      .map((r, i) => ({ ...r, index: i }))
      .filter((r) => r.metricType === type);

    // Aggregate by version: compute average value per metric name
    const chartData = filtered.map((record) => {
      const recordValues = values.filter(
        (v) => v.recordIndex === record.index,
      );

      const metricAverages: Record<string, number> = {};
      const metricCounts: Record<string, number> = {};

      for (const v of recordValues) {
        if (!metricAverages[v.metricName]) {
          metricAverages[v.metricName] = 0;
          metricCounts[v.metricName] = 0;
        }
        metricAverages[v.metricName] += v.value;
        metricCounts[v.metricName] += 1;
      }

      const averages: Record<string, number> = {};
      for (const key of Object.keys(metricAverages)) {
        averages[key] =
          Math.round((metricAverages[key] / metricCounts[key]) * 100) / 100;
      }

      return {
        version: record.version,
        testDate: record.testDate.toISOString(),
        ...averages,
      };
    });

    return NextResponse.json({ data: chartData, type });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 },
    );
  }
}

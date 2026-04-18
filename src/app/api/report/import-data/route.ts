import { NextResponse } from 'next/server';

const METRIC_TYPES = [
  {
    metricType: 'startup',
    title: 'Startup Performance',
    description: 'Cold start and hot start timing data',
  },
  {
    metricType: 'switching',
    title: 'Camera Switching',
    description: 'Front/rear camera and mode switching data',
  },
  {
    metricType: 'frame_rate',
    title: 'Frame Rate',
    description: 'Preview FPS, capture FPS, and frame interval data',
  },
  {
    metricType: 'static_memory',
    title: 'Static Memory',
    description: 'Idle, preview, and background memory usage',
  },
  {
    metricType: 'peak_memory',
    title: 'Peak Memory',
    description: 'Capture, video, and burst peak memory data',
  },
] as const;

export async function GET() {
  try {
    const data = METRIC_TYPES.map((item, index) => ({
      id: index + 1,
      metricType: item.metricType,
      title: item.title,
      description: item.description,
      available: true,
    }));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch import data' },
      { status: 500 },
    );
  }
}

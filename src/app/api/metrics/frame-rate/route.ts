import { NextRequest, NextResponse } from 'next/server';
import { generateSeedData } from '@/lib/seed-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const version = searchParams.get('version');

    const { records, values } = generateSeedData();

    let filtered = records
      .map((r, i) => ({ ...r, index: i }))
      .filter((r) => r.metricType === 'frame_rate');

    if (version) {
      filtered = filtered.filter((r) => r.version === version);
    }

    const data = filtered.map((record) => {
      const recordValues = values.filter(
        (v) => v.recordIndex === record.index,
      );
      return {
        id: record.index + 1,
        metricType: record.metricType,
        testDate: record.testDate.toISOString(),
        platform: record.platform,
        product: record.product,
        version: record.version,
        values: recordValues,
      };
    });

    return NextResponse.json({ data, total: data.length });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch frame rate metrics' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(
      { success: true, message: 'Frame rate metric saved', data: body },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to save frame rate metric' },
      { status: 400 },
    );
  }
}

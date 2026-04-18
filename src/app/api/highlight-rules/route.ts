import { NextRequest, NextResponse } from 'next/server';
import { getDefaultRulesForType } from '@/lib/highlight-rules';

const ALL_TYPES = [
  'startup',
  'switching',
  'frame_rate',
  'static_memory',
  'peak_memory',
] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type');

    if (type) {
      const rules = getDefaultRulesForType(type);
      return NextResponse.json({
        data: rules.map((r, i) => ({
          id: i + 1,
          metricType: type,
          ...r,
          isActive: true,
        })),
      });
    }

    // Return rules for all types
    let id = 1;
    const allRules = ALL_TYPES.flatMap((metricType) => {
      const rules = getDefaultRulesForType(metricType);
      return rules.map((r) => ({
        id: id++,
        metricType,
        ...r,
        isActive: true,
      }));
    });

    return NextResponse.json({ data: allRules });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch highlight rules' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json(
      {
        success: true,
        message: 'Highlight rule saved',
        data: { id: Date.now(), ...body, isActive: true },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to save highlight rule' },
      { status: 400 },
    );
  }
}

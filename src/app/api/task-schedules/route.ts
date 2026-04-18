import { NextRequest, NextResponse } from 'next/server';

const mockSchedules = [
  {
    id: 1,
    taskName: 'Daily Startup Benchmark',
    cronExpr: '0 2 * * *',
    taskType: 'benchmark',
    status: 'active' as const,
    lastRun: '2024-09-25T02:00:00.000Z',
    nextRun: '2024-09-26T02:00:00.000Z',
    createdAt: '2024-01-10T08:00:00.000Z',
  },
  {
    id: 2,
    taskName: 'Weekly Full Report',
    cronExpr: '0 8 * * 1',
    taskType: 'report',
    status: 'active' as const,
    lastRun: '2024-09-23T08:00:00.000Z',
    nextRun: '2024-09-30T08:00:00.000Z',
    createdAt: '2024-02-15T10:00:00.000Z',
  },
  {
    id: 3,
    taskName: 'Memory Leak Detection',
    cronExpr: '0 3 * * *',
    taskType: 'analysis',
    status: 'active' as const,
    lastRun: '2024-09-25T03:00:00.000Z',
    nextRun: '2024-09-26T03:00:00.000Z',
    createdAt: '2024-03-01T12:00:00.000Z',
  },
  {
    id: 4,
    taskName: 'Nightly Regression Test',
    cronExpr: '0 0 * * *',
    taskType: 'benchmark',
    status: 'paused' as const,
    lastRun: '2024-09-20T00:00:00.000Z',
    nextRun: null,
    createdAt: '2024-04-05T09:00:00.000Z',
  },
  {
    id: 5,
    taskName: 'Monthly Trend Summary',
    cronExpr: '0 9 1 * *',
    taskType: 'report',
    status: 'completed' as const,
    lastRun: '2024-09-01T09:00:00.000Z',
    nextRun: '2024-10-01T09:00:00.000Z',
    createdAt: '2024-05-20T14:00:00.000Z',
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      data: mockSchedules,
      total: mockSchedules.length,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch task schedules' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const created = {
      id: Date.now(),
      taskName: body.taskName,
      cronExpr: body.cronExpr,
      taskType: body.taskType,
      status: 'active' as const,
      lastRun: null,
      nextRun: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: 'Task schedule created', data: created },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to create task schedule' },
      { status: 400 },
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const reportSchema = z.object({
  subject: z.string().min(1),
  ccList: z.array(z.string().email()).optional(),
  versionInfo: z
    .object({
      platform: z.string(),
      product: z.string(),
      version: z.string(),
    })
    .optional(),
  topIssues: z.string().optional(),
  selectedMetrics: z.array(z.string()).optional(),
  contentHtml: z.string().optional(),
});

const mockReports = [
  {
    id: 1,
    subject: 'Camera Performance Report - v5.0',
    ccList: ['team-lead@example.com'],
    versionInfo: { platform: 'Android', product: 'CameraApp', version: 'v5.0' },
    topIssues: 'Cold start time regression in night mode; Memory peak exceeded threshold in burst capture',
    selectedMetrics: ['startup', 'peak_memory'],
    contentHtml: '<h1>Performance Report v5.0</h1>',
    status: 'sent' as const,
    sentAt: '2024-09-15T10:00:00.000Z',
    createdAt: '2024-09-15T09:30:00.000Z',
  },
  {
    id: 2,
    subject: 'Weekly Regression Summary - v4.0 vs v5.0',
    ccList: ['qa@example.com', 'dev@example.com'],
    versionInfo: { platform: 'Android', product: 'CameraApp', version: 'v5.0' },
    topIssues: 'Frame rate drops in low-light scenarios',
    selectedMetrics: ['frame_rate', 'switching'],
    contentHtml: '<h1>Regression Summary</h1>',
    status: 'draft' as const,
    sentAt: null,
    createdAt: '2024-09-20T14:00:00.000Z',
  },
  {
    id: 3,
    subject: 'Memory Usage Analysis - All Versions',
    ccList: [],
    versionInfo: { platform: 'Android', product: 'CameraApp', version: 'v3.0' },
    topIssues: 'Static memory stable; Peak memory trending upward since v3.0',
    selectedMetrics: ['static_memory', 'peak_memory'],
    contentHtml: '<h1>Memory Analysis</h1>',
    status: 'sent' as const,
    sentAt: '2024-09-22T08:00:00.000Z',
    createdAt: '2024-09-22T07:30:00.000Z',
  },
];

export async function GET() {
  try {
    return NextResponse.json({ data: mockReports, total: mockReports.length });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reportSchema.parse(body);

    const saved = {
      id: Date.now(),
      ...parsed,
      status: 'draft' as const,
      sentAt: null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: 'Report saved', data: saved },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to save report' },
      { status: 400 },
    );
  }
}

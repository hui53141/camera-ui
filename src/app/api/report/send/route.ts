import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const sendReportSchema = z.object({
  to: z.string().email(),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = sendReportSchema.parse(body);

    // Log what would be sent (mock send — SMTP not configured)
    console.log('[Report Send] Would send email:', {
      to: parsed.to,
      cc: parsed.ccList,
      subject: parsed.subject,
      hasContent: !!parsed.contentHtml,
      metrics: parsed.selectedMetrics,
    });

    return NextResponse.json({
      success: true,
      message: '报告发送成功',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: 'Failed to send report' },
      { status: 400 },
    );
  }
}

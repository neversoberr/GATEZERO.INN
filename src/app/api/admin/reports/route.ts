import { NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const stats = db.getPlatformStats();
    const reports = db.getReports();
    return NextResponse.json({ success: true, stats, reports });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

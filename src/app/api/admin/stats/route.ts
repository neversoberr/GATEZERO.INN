import { NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET() {
  try {
    const stats = db.getPlatformStats();
    const auditLogs = db.getAuditLogs();
    const orders = db.getOrders();
    const organizers = db.getOrganizers();
    const events = db.getEvents({ status: undefined });
    const settlements = db.getSettlements();

    return NextResponse.json({
      success: true,
      stats,
      auditLogs,
      recentOrders: orders.slice(0, 10),
      organizers,
      events,
      settlements
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

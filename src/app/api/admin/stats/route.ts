import { NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const stats = db.getPlatformStats();
    const auditLogs = db.getAuditLogs();
    const orders = db.getOrders();
    const organizers = db.getOrganizers();
    const events = db.getAllEvents();
    const settlements = db.getSettlements();
    const reports = db.getReports();
    const users = db.getUsers();

    return NextResponse.json({
      success: true,
      stats,
      auditLogs,
      orders,
      recentOrders: orders.slice(0, 10),
      organizers,
      events,
      settlements,
      reports,
      users
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

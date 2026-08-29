import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }
    const notifications = db.getNotifications(userId);
    const unread = notifications.filter(n => !n.read).length;
    return NextResponse.json({ success: true, notifications, unread });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, notificationId } = await req.json();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }
    db.markNotificationsRead(userId, notificationId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

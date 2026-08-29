import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { userId, eventId } = await req.json();

    if (!userId || !eventId) {
      return NextResponse.json({ success: false, error: 'User ID and Event ID required' }, { status: 400 });
    }

    const ok = db.toggleSaveEvent(userId, eventId);
    const user = db.getUserById(userId);
    return NextResponse.json({ success: ok, savedEventIds: user?.savedEventIds || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

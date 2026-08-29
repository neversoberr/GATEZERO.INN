import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { eventId, title, body } = await req.json();
    if (!eventId || !body) {
      return NextResponse.json({ success: false, error: 'Event and message required' }, { status: 400 });
    }
    const sent = db.broadcastToEvent(eventId, title || 'ORGANIZER DISPATCH', body);
    return NextResponse.json({ success: true, sent });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';
import { EventStatus } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { eventId, action, featured } = await req.json();
    if (!eventId) {
      return NextResponse.json({ success: false, error: 'eventId required' }, { status: 400 });
    }

    const event = db.getEventById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    let updates: Partial<typeof event> = {};
    if (action === 'approve') updates.status = 'published' as EventStatus;
    if (action === 'reject') updates.status = 'cancelled' as EventStatus;
    if (action === 'pause') updates.status = 'paused' as EventStatus;
    if (action === 'resume') updates.status = 'published' as EventStatus;
    if (typeof featured === 'boolean') updates.isFeatured = featured;

    const updated = db.updateEvent(eventId, updates);
    db.addAuditLog({
      adminEmail: 'admin@gatezero.in',
      action: `EVENT_${String(action || 'UPDATE').toUpperCase()}`,
      targetType: 'event',
      targetId: eventId,
      details: `Moderation action on ${event.title}: ${action || 'feature toggle'}`
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

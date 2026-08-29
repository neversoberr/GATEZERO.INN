import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = db.getEventBySlug(slug) || db.getEventById(slug);

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    db.incrementEventViews(event.id);
    const tiers = db.getTicketTiers(event.id);
    const organizer = db.getOrganizerById(event.organizerId);

    return NextResponse.json({ success: true, event, tiers, organizer });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();
    const event = db.getEventBySlug(slug) || db.getEventById(slug);

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    const updated = db.updateEvent(event.id, body);
    return NextResponse.json({ success: true, event: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = db.getEventBySlug(slug) || db.getEventById(slug);

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    db.deleteEvent(event.id);
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

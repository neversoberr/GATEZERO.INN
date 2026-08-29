import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const organizer = db.getOrganizerBySlug(slug) || db.getOrganizerById(slug);

    if (!organizer) {
      return NextResponse.json({ success: false, error: 'Organizer not found' }, { status: 404 });
    }

    const allEvents = db.getEvents();
    const organizerEvents = allEvents.filter(e => e.organizerId === organizer.id);

    return NextResponse.json({ success: true, organizer, events: organizerEvents });
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
    const organizer = db.getOrganizerBySlug(slug) || db.getOrganizerById(slug);

    if (!organizer) {
      return NextResponse.json({ success: false, error: 'Organizer not found' }, { status: 404 });
    }

    const updated = db.updateOrganizer(organizer.id, body);
    return NextResponse.json({ success: true, organizer: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

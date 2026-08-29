import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || undefined;
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('query') || undefined;
    const format = searchParams.get('format') || undefined;
    const age = searchParams.get('age') || undefined;
    const isFeatured = searchParams.get('featured') === 'true';
    const isTrending = searchParams.get('trending') === 'true';
    const verifiedOnly = searchParams.get('verifiedOnly') === 'true';
    const availableOnly = searchParams.get('availableOnly') === 'true';
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const sort = searchParams.get('sort') || undefined;
    const status = searchParams.get('status') || undefined;

    const events = db.getEvents({
      city,
      category,
      query,
      format,
      age,
      isFeatured: isFeatured ? true : undefined,
      isTrending: isTrending ? true : undefined,
      verifiedOnly: verifiedOnly ? true : undefined,
      availableOnly: availableOnly ? true : undefined,
      maxPrice,
      sort,
      status
    });

    return NextResponse.json({ success: true, events });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, tiers } = body;

    if (!event.title || !event.city || !event.category) {
      return NextResponse.json({ success: false, error: 'Missing required event fields' }, { status: 400 });
    }

    const newEvent = db.createEvent(event, tiers || []);
    return NextResponse.json({ success: true, event: newEvent });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

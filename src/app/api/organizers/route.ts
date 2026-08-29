import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';
import { OrganizerCompany } from '@/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const organizers = db.getOrganizers();
    return NextResponse.json({ success: true, organizers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Organizer name required' }, { status: 400 });
    }

    const newOrg: OrganizerCompany = {
      ...body,
      id: body.id || `org_${Date.now()}`,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      tagline: body.tagline || `Independent collective from ${body.city || 'India'}`,
      description: body.description || `${body.name} is onboarding as a Gate Zero host.`,
      logoUrl: body.logoUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300&auto=format&fit=crop',
      coverUrl: body.coverUrl || 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?q=80&w=1200&auto=format&fit=crop',
      isVerified: false,
      city: body.city || 'Mumbai',
      country: body.country || 'India',
      email: body.email || `contact@${(body.slug || 'host')}.in`,
      phone: body.phone || '+91 98000 00000',
      followersCount: 0,
      totalEventsHosted: 0,
      rating: 5.0,
      totalReviews: 0,
      categories: body.categories || ['underground'],
      kycStatus: 'pending',
      teamMembers: body.teamMembers || []
    };

    const created = db.createOrganizer(newOrg, body.userId);
    const user = body.userId ? db.getUserById(body.userId) : undefined;
    return NextResponse.json({ success: true, organizer: created, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

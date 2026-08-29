import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

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
    const organizers = db.getOrganizers();
    
    const newOrg = {
      ...body,
      id: body.id || `org_${Date.now()}`,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      isVerified: false,
      kycStatus: 'pending',
      followersCount: 0,
      totalEventsHosted: 0,
      rating: 5.0,
      totalReviews: 0,
      teamMembers: body.teamMembers || []
    };

    organizers.unshift(newOrg);
    return NextResponse.json({ success: true, organizer: newOrg });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

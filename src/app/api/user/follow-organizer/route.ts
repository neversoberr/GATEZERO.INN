import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { userId, organizerId } = await req.json();

    if (!userId || !organizerId) {
      return NextResponse.json({ success: false, error: 'User ID and Organizer ID required' }, { status: 400 });
    }

    const ok = db.toggleFollowOrganizer(userId, organizerId);
    const user = db.getUserById(userId);
    const org = db.getOrganizerById(organizerId);

    return NextResponse.json({ 
      success: ok, 
      followedOrganizerIds: user?.followedOrganizerIds || [],
      followersCount: org?.followersCount || 0
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

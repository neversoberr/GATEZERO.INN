import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { organizerId, approved } = await req.json();
    if (!organizerId) {
      return NextResponse.json({ success: false, error: 'organizerId required' }, { status: 400 });
    }

    const updated = db.updateOrganizer(organizerId, {
      isVerified: !!approved,
      kycStatus: approved ? 'verified' : 'rejected',
      verifiedAt: approved ? new Date().toISOString() : undefined
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Organizer not found' }, { status: 404 });
    }

    db.addAuditLog({
      adminEmail: 'admin@gatezero.in',
      action: approved ? 'KYC_VERIFIED' : 'KYC_REJECTED',
      targetType: 'organizer',
      targetId: organizerId,
      details: `${approved ? 'Verified' : 'Rejected'} KYC for ${updated.name}`
    });

    return NextResponse.json({ success: true, organizer: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

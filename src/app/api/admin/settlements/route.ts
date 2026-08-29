import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('organizerId') || undefined;
    const settlements = db.getSettlements(orgId);
    return NextResponse.json({ success: true, settlements });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { settlementId, bankReference } = await req.json();

    if (!settlementId) {
      return NextResponse.json({ success: false, error: 'Settlement ID is required' }, { status: 400 });
    }

    const success = db.releaseSettlement(settlementId, bankReference);
    return NextResponse.json({ success, message: success ? 'Settlement marked as paid' : 'Settlement not found' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    return NextResponse.json({ success: true, promoCodes: db.getPromoCodes() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.code || !body.discountValue) {
      return NextResponse.json({ success: false, error: 'Code and discount value required' }, { status: 400 });
    }

    const promo = db.savePromoCode({
      id: body.id || `promo_${Date.now()}`,
      eventId: body.eventId,
      code: String(body.code).trim().toUpperCase(),
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue),
      minOrderValue: body.minOrderValue,
      maxDiscount: body.maxDiscount,
      totalLimit: Number(body.totalLimit || 100),
      usedCount: 0,
      expiryDate: body.expiryDate || '2026-12-31T23:59:59Z',
      isActive: true
    });

    return NextResponse.json({ success: true, promo });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

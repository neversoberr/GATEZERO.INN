import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { code, eventId, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'PLEASE ENTER A PROMO CODE' }, { status: 400 });
    }

    const result = db.validatePromoCode(code, eventId || '', Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}

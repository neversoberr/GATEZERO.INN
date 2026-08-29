import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { orderId, approved } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID required' }, { status: 400 });
    }

    const success = db.processRefund(orderId, approved);
    return NextResponse.json({
      success,
      message: approved ? 'Refund processed and inventory released' : 'Refund rejected'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

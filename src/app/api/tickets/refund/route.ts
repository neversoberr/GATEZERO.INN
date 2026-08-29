import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { orderId, reason } = await req.json();

    if (!orderId || !reason) {
      return NextResponse.json({ success: false, error: 'Order ID and reason are required' }, { status: 400 });
    }

    const success = db.requestRefund(orderId, reason);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Refund request submitted to Gate Zero Compliance Team' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

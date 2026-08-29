import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || undefined;
    const eventId = searchParams.get('eventId') || undefined;

    const orders = db.getOrders({ userId, eventId });
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    if (!orderData.eventId || !orderData.customerEmail || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid order payload' }, { status: 400 });
    }

    const created = db.createOrder(orderData);
    return NextResponse.json({ success: true, order: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

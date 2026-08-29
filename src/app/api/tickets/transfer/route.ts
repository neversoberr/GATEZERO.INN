import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  try {
    const { ticketCode, newFullName, newEmail, newPhone } = await req.json();

    if (!ticketCode || !newFullName || !newEmail) {
      return NextResponse.json({ success: false, error: 'Recipient name and email required' }, { status: 400 });
    }

    const success = db.transferTicket(ticketCode, newFullName, newEmail, newPhone || '');
    if (!success) {
      return NextResponse.json({ success: false, error: 'Ticket not found or could not be transferred' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Access pass transferred to ${newFullName}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

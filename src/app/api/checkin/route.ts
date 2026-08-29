import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId') || undefined;
    const logs = db.getCheckIns(eventId);
    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketCode, staffName, gate } = body;

    if (!ticketCode) {
      return NextResponse.json({ success: false, error: 'Ticket code is required' }, { status: 400 });
    }

    const result = db.checkInTicket(ticketCode, staffName || 'Gate 01 Staff', gate || 'GATE 01');
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { ticketCode } = body;

    if (!ticketCode) {
      return NextResponse.json({ success: false, error: 'Ticket code is required' }, { status: 400 });
    }

    const undone = db.undoCheckIn(ticketCode);
    return NextResponse.json({ success: undone, message: undone ? 'Check-in reverted' : 'Failed to undo' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

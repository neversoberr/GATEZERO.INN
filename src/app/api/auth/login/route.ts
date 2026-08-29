import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { emailOrPhone } = await req.json();
    if (!emailOrPhone) {
      return NextResponse.json({ success: false, error: 'Email or phone is required' }, { status: 400 });
    }

    const user = db.loginUser(emailOrPhone);
    if (!user) {
      return NextResponse.json({ success: false, error: 'No identity found. Create a Gate Zero account.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

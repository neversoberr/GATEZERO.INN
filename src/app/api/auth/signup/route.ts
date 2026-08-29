import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, city } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const result = db.signupUser({
      name,
      email,
      phone: phone || '+91 98000 00000',
      city
    });

    return NextResponse.json({
      success: true,
      user: result.user,
      created: result.created
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const userId = new URL(req.url).searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId required' }, { status: 400 });
    }
    const user = db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'User id required' }, { status: 400 });
    }
    const existing = db.getUserById(body.id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }
    const user = db.saveUser({ ...existing, ...body, id: existing.id, email: existing.email });
    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

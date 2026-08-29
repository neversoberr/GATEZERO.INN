import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const userId = searchParams.get('userId');

    if (code) {
      const promoter = db.getPromoterByCode(code);
      return NextResponse.json({ success: true, promoter });
    }

    if (userId) {
      const promoter = db.getPromoterByUserId(userId);
      return NextResponse.json({ success: true, promoter });
    }

    const promoters = db.getPromoters();
    return NextResponse.json({ success: true, promoters });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = db.createPromoter(body);
    return NextResponse.json({ success: true, promoter: created });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

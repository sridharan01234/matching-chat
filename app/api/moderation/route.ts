import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { moderateText } from '@/lib/moderation';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json();
  const result = await moderateText(text);

  return NextResponse.json(result);
}
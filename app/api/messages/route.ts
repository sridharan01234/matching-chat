import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { moderateText } from '@/lib/moderation';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text, chatId, citedMsgId } = await req.json();
  
  // Moderate content
  const moderation = await moderateText(text);
  if (!moderation.isSafe) {
    return NextResponse.json({ error: 'Content flagged as inappropriate' }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      citedMsgId,
      senderId: session.user.id,
    },
  });

  return NextResponse.json(message);
}

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json({ error: 'Chat ID required' }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
    include: { sender: true },
  });

  return NextResponse.json(messages);
}
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(announcements);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const { title, body, targetAudience } = data;

  if (!title?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: title.trim(),
      body: body.trim(),
      targetAudience: targetAudience || 'ALL',
      authorEmail: session.user.email!,
    },
  });

  return NextResponse.json(announcement, { status: 201 });
}

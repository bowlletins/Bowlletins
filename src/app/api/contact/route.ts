import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const data = await request.json();
  const { name, email, subject, body } = data;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !body?.trim()) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({
    data: {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      body: body.trim(),
    },
  });

  return NextResponse.json(message, { status: 201 });
}

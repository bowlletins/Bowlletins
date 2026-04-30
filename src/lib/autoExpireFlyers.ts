import { prisma } from '@/lib/prisma';

export async function autoExpireFlyers() {
  await prisma.flyer.updateMany({
    where: {
      isPrivate: false,
      expiresAt: { lt: new Date() },
    },
    data: { isPrivate: true },
  });
}

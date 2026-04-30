import { prisma } from '@/lib/prisma';
import { autoExpireFlyers } from '@/lib/autoExpireFlyers';
import ExploreClient from './ExploreClient';

export default async function ExplorePage() {
  await autoExpireFlyers();

  const flyers = await prisma.flyer.findMany({
    where: { isPrivate: false },
    orderBy: {
      id: 'desc',
    },
  });

  return <ExploreClient flyers={flyers} />;
}
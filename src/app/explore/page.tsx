import { prisma } from '@/lib/prisma';
import ExploreClient from './ExploreClient';

export default async function ExplorePage() {
  const flyers = await prisma.flyer.findMany({
    orderBy: {
      id: 'desc',
    },
  });

  return <ExploreClient flyers={flyers} />;
}
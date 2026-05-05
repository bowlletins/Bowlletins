import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FlyerDetailCard from '@/components/FlyerDetailCard';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';


const FlyerDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();
  
  const flyer = await prisma.flyer.findUnique({
    where: { id: Number(id) },
  });

  if (!flyer) return notFound();

  if (flyer.isPrivate && session?.user?.email !== flyer.owner) return notFound();

  return (
    <main className="flyer-detail-page">
    <div className="flyer-detail-back">
      <BackButton />
    </div>

      <Container className="py-5 d-flex justify-content-center">
        <FlyerDetailCard flyer={flyer} userEmail = {session?.user?.email ?? null} />
      </Container>
    </main>
  );
};

export default FlyerDetailPage;
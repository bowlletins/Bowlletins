import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import FlyerDetailCard from '@/components/FlyerDetailCard';
import { auth } from '@/lib/auth';
import BackButton from '@/components/BackButton';
import Link from 'next/link';

const FlyerDetailPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; edited?: string }>;
}) => {
  const { id } = await params;
  const { created, edited } = await searchParams;
  const session = await auth();

  const justCreated = created === 'true';
  const justEdited = edited === 'true';

  const flyer = await prisma.flyer.findUnique({
    where: { id: Number(id) },
  });

  if (!flyer) return notFound();

  if (flyer.isPrivate && session?.user?.email !== flyer.owner) return notFound();

  return (
    <main className="flyer-detail-page">
      {!justCreated && !justEdited && (
        <div className="flyer-detail-back">
          <BackButton />
        </div>
      )}

      <Container fluid className="py-5 d-flex justify-content-center flyer-detail-container">
        <FlyerDetailCard
          flyer={flyer}
          userEmail={session?.user?.email ?? null}
          justCreated={justCreated}
        />
      </Container>

      {justEdited && session?.user?.email && (
        <div className="flyer-after-edit-buttons">
          <Link href="/homeDashboard" className="flyer-dashboard-btn">
            Go to Dashboard
          </Link>

          <Link href="/homeDashboard?tab=myFlyers" className="flyer-edit-more-btn">
            Edit More
          </Link>
        </div>
      )}
    </main>
  );
};

export default FlyerDetailPage;
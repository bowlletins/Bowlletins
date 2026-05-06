import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import EditFlyerForm from '@/components/EditFlyerForm';

const EditFlyerPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.email) redirect('/auth/signin');

  const flyer = await prisma.flyer.findUnique({
    where: { id: Number(id) },
  });

  if (!flyer) return notFound();

  if (flyer.owner !== session.user.email) redirect(`/flyers/${id}`);

  return (
    <main className="create-flyer-page">
      <Container className="py-5 d-flex justify-content-center">
        <EditFlyerForm flyer={flyer} />
      </Container>
    </main>
  );
};

export default EditFlyerPage;

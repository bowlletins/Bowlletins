import { Container, Row, Col } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Category } from '@prisma/client';
import FlyerCard from '@/components/FlyerCard';

const validCategories = ['Jobs', 'Internships', 'Events', 'StudyGroups', 'Social', 'Clubs'];

const CategoryPage = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;

  if (!validCategories.includes(category)) return notFound();

  const flyers = await prisma.flyer.findMany({
    where: { category: category as Category },
  });

  return (
    <main className="category-page">
      <Container className="py-5">
        <div className="category-header">
          <h1 className="category-title">{category}</h1>
          <p className="category-subtitle">Browse all {category} flyers</p>
        </div>
        {flyers.length === 0 ? (
          <div className="category-empty">
            <div className="category-empty-note">
              <div className="flyer-pin pin-red" />
              <p className="category-empty-text">No flyers posted yet!</p>
              <p className="category-empty-subtext">Check back later or post your own.</p>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {flyers.map((flyer) => (
              <Col key={flyer.id} xs={12} sm={6} md={4} lg={3}>
                <FlyerCard flyer={flyer} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  );
};

export default CategoryPage;
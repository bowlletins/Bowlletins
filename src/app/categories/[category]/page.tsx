import { Container } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

const validCategories = ['Jobs', 'Internships', 'Events', 'StudyGroups', 'Social', 'Clubs'];

const CategoryPage = async ({ params }: { params: Promise<{ category: string }> }) => {
  const { category } = await params;

  if (!validCategories.includes(category)) return notFound();

  return (
    <main className="category-page">
      <Container className="py-5">
        <div className="category-header">
          <h1 className="category-title">{category}</h1>
          <p className="category-subtitle">Browse all {category} flyers</p>
        </div>
      </Container>
    </main>
  );
};

export default CategoryPage;
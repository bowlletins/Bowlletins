'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline-success"
      className="back-button"
      onClick={() => router.back()}
    >
      <ArrowLeft className="me-2" />
      Back
    </Button>
  );
};

export default BackButton;
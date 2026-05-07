'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'react-bootstrap-icons';

const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      className="back-button"
      onClick={() => router.back()}
    >
      <ArrowLeft className="me-1" />
      Back
    </button>
  );
};

export default BackButton;
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { createFlyer } from './actions';
import { CreateFlyerSchema } from '@/lib/validationSchemas';
import { ValidationError } from 'yup';
import BackButton from '@/components/BackButton';

const CreateFlyerPage = () => {
  const { status } = useSession();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flyerColor, setFlyerColor] = useState('#fff7b3');

  if (status === 'loading') {
    return (
      <main className="create-flyer-page">
        <p>Loading...</p>
      </main>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    setErrors({});
    try {
      await CreateFlyerSchema.validate(
        {
          title: formData.get('title'),
          description: formData.get('description'),
          category: formData.get('category'),
          date: formData.get('date'),
          location: formData.get('location'),
          contactInfo: formData.get('contactInfo'),
        },
        { abortEarly: false },
      );
    } catch (err) {
      if (err instanceof ValidationError) {
        const fieldErrors: Record<string, string> = {};
        (err.inner.length ? err.inner : [err]).forEach((e) => {
          if (e.path) fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }
      throw err;
    }

    await createFlyer(formData);
  };

  return (
  <main className="create-flyer-page">
    <BackButton />
      <div className="create-flyer-note">
        <div className="flyer-pin pin-red" />
        <div className="flyer-note-corner-rainbow" />
        <h1 className="create-flyer-title text-center">Create a Flyer</h1>
        <p className="create-flyer-subtitle text-center">Share your event, job, or opportunity with UH Mānoa</p>

<Form action={handleSubmit} data-testid="create-flyer-form">
  <Row>
    <Col xs={12}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Title</Form.Label>
        <Form.Control
          name="title"
          type="text"
          placeholder="Enter flyer title"
          className="create-flyer-input"
        />
        {errors.title && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.title}</Alert>}
      </Form.Group>
    </Col>

    <Col xs={12}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Description</Form.Label>
        <Form.Control
          name="description"
          as="textarea"
          rows={3}
          placeholder="Describe your flyer"
          className="create-flyer-input"
        />
        {errors.description && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.description}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Category</Form.Label>
        <Form.Select name="category" className="create-flyer-input">
          <option value="">Select a category</option>
          <option value="Jobs">Jobs</option>
          <option value="Internships">Internships</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Events">Events</option>
          <option value="Academics">Academics</option>
          <option value="Social">Social</option>
          <option value="Clubs_Organizations">Clubs_Organizations</option>
        </Form.Select>
        {errors.category && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.category}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Date</Form.Label>
        <Form.Control
          name="date"
          type="date"
          className="create-flyer-input"
        />
        {errors.date && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.date}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Location</Form.Label>
        <Form.Control
          name="location"
          type="text"
          placeholder="Enter location"
          className="create-flyer-input"
        />
        {errors.location && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.location}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Contact Info</Form.Label>
        <Form.Control
          name="contactInfo"
          type="text"
          placeholder="Email or phone number"
          className="create-flyer-input"
        />
        {errors.contactInfo && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.contactInfo}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-4">
        <Form.Label className="create-flyer-label">Flyer Color</Form.Label>

        <input type="hidden" name="flyerColor" value={flyerColor} />

        <div className="flyer-color-options">
          {[
            '#fff7b3',
            '#ffd6a5',
            '#caffbf',
            '#bde0fe',
            '#ffc8dd',
            '#d0bfff',
          ].map((color) => (
            <button
              key={color}
              type="button"
              className={`flyer-color-btn ${flyerColor === color ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => setFlyerColor(color)}
              aria-label={`Select flyer color ${color}`}
            />
          ))}
        </div>
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-4 create-flyer-private-box">
        <Form.Check
          type="switch"
          id="isPrivate"
          name="isPrivate"
          label="Make this flyer private"
          className="create-flyer-private-toggle"
        />
        <Form.Text className="create-flyer-private-hint">
          Private flyers are only visible to you.
        </Form.Text>
      </Form.Group>
    </Col>

    <Col xs={12}>
      <Button type="submit" className="create-flyer-btn w-100">
        Post Flyer
      </Button>
    </Col>
  </Row>
</Form>
      </div>
    </main>
  );
};

export default CreateFlyerPage;
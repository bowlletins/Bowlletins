'use client';

import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createFlyer } from './actions';

const CreateFlyerPage = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (formData: FormData) => {
    const newErrors: Record<string, string> = {};

    if (!formData.get('title')) newErrors.title = 'Title is required';
    if (!formData.get('description')) newErrors.description = 'Description is required';
    if (!formData.get('category')) newErrors.category = 'Please select a category';
    if (!formData.get('date')) newErrors.date = 'Date is required';
    if (!formData.get('location')) newErrors.location = 'Location is required';
    if (!formData.get('contactInfo')) newErrors.contactInfo = 'Contact info is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await createFlyer(formData);
  };

  return (
    <main className="create-flyer-page">
      <div className="create-flyer-note">
        <div className="flyer-pin pin-red" />
        <div className="flyer-note-corner-rainbow" />
        <h1 className="create-flyer-title">Post a Flyer</h1>
        <p className="create-flyer-subtitle">Share your event, job, or opportunity with UH Mānoa</p>

        <Form action={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Title</Form.Label>
            <Form.Control name="title" type="text" placeholder="Enter flyer title" className="create-flyer-input" />
            {errors.title && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.title}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Description</Form.Label>
            <Form.Control name="description" as="textarea" rows={3} placeholder="Describe your flyer" className="create-flyer-input" />
            {errors.description && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.description}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Category</Form.Label>
            <Form.Select name="category" className="create-flyer-input">
              <option value="">Select a category</option>
              <option value="Jobs">Jobs</option>
              <option value="Internships">Internships</option>
              <option value="Events">Events</option>
              <option value="StudyGroups">Study Groups</option>
              <option value="Social">Social</option>
              <option value="Clubs">Clubs</option>
            </Form.Select>
            {errors.category && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.category}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Date</Form.Label>
            <Form.Control name="date" type="date" className="create-flyer-input" />
            {errors.date && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.date}</Alert>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Location</Form.Label>
            <Form.Control name="location" type="text" placeholder="Enter location" className="create-flyer-input" />
            {errors.location && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.location}</Alert>}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="create-flyer-label">Contact Info</Form.Label>
            <Form.Control name="contactInfo" type="text" placeholder="Email or phone number" className="create-flyer-input" />
            {errors.contactInfo && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.contactInfo}</Alert>}
          </Form.Group>

          <Button type="submit" className="create-flyer-btn w-100">Post Flyer</Button>
        </Form>
      </div>
    </main>
  );
};

export default CreateFlyerPage;
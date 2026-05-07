'use client';

import { Flyer } from '@prisma/client';
import { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { editFlyer } from '@/app/flyers/[id]/actions';
import { CreateFlyerSchema } from '@/lib/validationSchemas';
import { ValidationError } from 'yup';

const EditFlyerForm = ({ flyer }: { flyer: Flyer }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flyerColor, setFlyerColor] = useState(flyer.flyerColor || '#fff7b3');
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

    await editFlyer(flyer.id, formData);
  };

  return (
    <div className="create-flyer-note">
      <div className="flyer-pin pin-red" />
      <div className="flyer-note-corner-rainbow" />
      <h1 className="create-flyer-title">Edit Flyer</h1>
      <p className="create-flyer-subtitle">Update your event, job, or opportunity</p>

<Form action={handleSubmit}>
  <Row>
    <Col xs={12}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Title</Form.Label>
        <Form.Control
          name="title"
          type="text"
          defaultValue={flyer.title}
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
          defaultValue={flyer.description}
          placeholder="Describe your flyer"
          className="create-flyer-input"
        />
        {errors.description && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.description}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-3">
        <Form.Label className="create-flyer-label">Category</Form.Label>
        <Form.Select name="category" defaultValue={flyer.category} className="create-flyer-input">
          <option value="">Select a category</option>
          <option value="Jobs">Jobs</option>
          <option value="Internships">Internships</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Events">Events</option>
          <option value="Academics">Academics</option>
          <option value="Social">Social</option>
          <option value="Clubs_Organizations">Clubs_Organizations</option>
          <option value="Other">Other</option>
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
          defaultValue={flyer.date}
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
          defaultValue={flyer.location}
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
          defaultValue={flyer.contactInfo}
          placeholder="Email or phone number"
          className="create-flyer-input"
        />
        {errors.contactInfo && <Alert variant="danger" className="mt-1 py-1 px-2 small">{errors.contactInfo}</Alert>}
      </Form.Group>
    </Col>

    <Col md={6}>
      <Form.Group className="mb-4">
        <Form.Label className="create-flyer-label">Choose a Flyer Color</Form.Label>

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
          defaultChecked={flyer.isPrivate}
        />
        <Form.Text className="create-flyer-private-hint">
          Private flyers are only visible to you.
        </Form.Text>
      </Form.Group>
    </Col>

    <Col xs={12}>
      <div className="d-flex gap-2">
        <Button type="submit" className="create-flyer-btn flex-grow-1">
          Save Changes
        </Button>

<Button
  type="button"
  href="/homeDashboard?tab=myFlyers"
  className="flyer-btn-share"
>
  Cancel
</Button>
      </div>
    </Col>
  </Row>
</Form>
</div>

);
};

export default EditFlyerForm;

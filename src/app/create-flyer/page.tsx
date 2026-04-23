'use client';

import { Form, Button } from 'react-bootstrap';

const CreateFlyerPage = () => {
  return (
    <main className="create-flyer-page">
      <div className="create-flyer-note">
        <div className="flyer-pin pin-red" />
        <div className="flyer-note-corner-rainbow" />
        <h1 className="create-flyer-title">Post a Flyer</h1>
        <p className="create-flyer-subtitle">Share your event, job, or opportunity with UH Mānoa</p>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Title</Form.Label>
            <Form.Control type="text" placeholder="Enter flyer title" className="create-flyer-input" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Describe your flyer" className="create-flyer-input" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Date</Form.Label>
            <Form.Control type="text" placeholder="e.g. April 25, 2026" className="create-flyer-input" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="create-flyer-label">Location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" className="create-flyer-input" />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="create-flyer-label">Contact Info</Form.Label>
            <Form.Control type="text" placeholder="Email or phone number" className="create-flyer-input" />
          </Form.Group>

          <Button className="create-flyer-btn w-100">Post Flyer</Button>
        </Form>
      </div>
    </main>
  );
};

export default CreateFlyerPage;
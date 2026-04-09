import { Flyer } from '@prisma/client';
import { CalendarEventFill, GeoAltFill, EnvelopeFill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

const FlyerDetailCard = ({ flyer }: { flyer: Flyer }) => (
  <div className="flyer-detail-note">
    <div className="flyer-pin pin-red" />
    <div className="flyer-note-corner-rainbow" />

    <span className="flyer-category-badge">{flyer.category}</span>
    <h1 className="flyer-detail-title">{flyer.title}</h1>
    <p className="flyer-detail-description">{flyer.description}</p>

    <hr className="flyer-divider" />

    <div className="flyer-detail-info">
      <div className="flyer-info-row">
        <CalendarEventFill className="flyer-info-icon" />
        <span>{flyer.date}</span>
      </div>
      <div className="flyer-info-row">
        <GeoAltFill className="flyer-info-icon" />
        <span>{flyer.location}</span>
      </div>
      <div className="flyer-info-row">
        <EnvelopeFill className="flyer-info-icon" />
        <span>{flyer.contactInfo}</span>
      </div>
    </div>

    <div className="flyer-action-buttons">
      <Button className="flyer-btn-rsvp">RSVP</Button>
      <Button className="flyer-btn-save">Save</Button>
      <Button className="flyer-btn-share">Share</Button>
    </div>
  </div>
);

export default FlyerDetailCard;
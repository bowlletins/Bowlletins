import { Flyer } from '@prisma/client';
import { CalendarEventFill, GeoAltFill } from 'react-bootstrap-icons';

const FlyerDetailCard = ({ flyer }: { flyer: Flyer }) => (
  <div className="flyer-detail-note">
    <div className="flyer-pin pin-red" />
    <div className="flyer-note-corner-rainbow" />

    <h1 className="flyer-detail-title">{flyer.title}</h1>
    <p className="flyer-detail-description">{flyer.description}</p>

    <div className="flyer-detail-info">
      <div className="flyer-info-row">
        <CalendarEventFill className="flyer-info-icon" />
        <span>{flyer.date}</span>
      </div>
      <div className="flyer-info-row">
        <GeoAltFill className="flyer-info-icon" />
        <span>{flyer.location}</span>
      </div>
    </div>
  </div>
);

export default FlyerDetailCard;
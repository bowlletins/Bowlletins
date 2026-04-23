import { Flyer } from '@prisma/client';
import Link from 'next/link';
import { CalendarEventFill, GeoAltFill } from 'react-bootstrap-icons';

const FlyerCard = ({ flyer }: { flyer: Flyer }) => (
  <Link href={`/flyers/${flyer.id}`} className="flyer-card-link">
    <div className="flyer-card">
      <div className="flyer-card-pin" />
      <span className="flyer-card-badge">{flyer.category}</span>
      <h3 className="flyer-card-title">{flyer.title}</h3>
      <p className="flyer-card-description">{flyer.description}</p>
      <div className="flyer-card-info">
        <div className="flyer-card-row">
          <CalendarEventFill className="flyer-info-icon" />
          <span>{flyer.date}</span>
        </div>
        <div className="flyer-card-row">
          <GeoAltFill className="flyer-info-icon" />
          <span>{flyer.location}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default FlyerCard;
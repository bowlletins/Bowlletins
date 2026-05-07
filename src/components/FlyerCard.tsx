import { Flyer } from '@prisma/client';
import Link from 'next/link';
import { CalendarEventFill, GeoAltFill } from 'react-bootstrap-icons';

const getUrgencyBadge = (date: string) => {
  const flyerDate = new Date(date);
  const today = new Date();

  flyerDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (flyerDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) return null;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays <= 7) return 'Coming Soon';

  return null;
};

const FlyerCard = ({ flyer }: { flyer: Flyer }) => {
  const urgencyBadge = getUrgencyBadge(flyer.date);

  return (
    <Link href={`/flyers/${flyer.id}`} className="flyer-card-link">
      <div
        className="flyer-card"
        style={
          flyer.flyerColor && flyer.flyerColor !== '#fff7b3'
            ? { background: flyer.flyerColor }
            : undefined
        }
      >
        <div className="flyer-card-pin" />

        <div className="flyer-card-badge-row">
          <span className="flyer-card-badge">{flyer.category}</span>

          {urgencyBadge && (
            <span className="flyer-urgency-badge">{urgencyBadge}</span>
          )}
        </div>

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
};

export default FlyerCard;
'use client';

import { Flyer } from '@prisma/client';
import { CalendarEventFill, GeoAltFill, EnvelopeFill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { saveFlyer, unsaveFlyer, toggleFlyerPrivacy, rsvpFlyer, unrsvpFlyer } from '@/app/flyers/[id]/actions';

const FlyerDetailCard = ({ flyer, userEmail }: { flyer: Flyer; userEmail: string | null }) => {
  const [saved, setSaved] = useState(userEmail ? flyer.savedBy.includes(userEmail) : false);
  const [isPrivate, setIsPrivate] = useState(flyer.isPrivate);
  const [loading, setLoading] = useState(false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const isOwner = userEmail !== null && userEmail === flyer.owner;
const [rsvped, setRsvped] = useState(flyer.rsvpBy?.includes(userEmail ?? '') ?? false);
const [rsvpLoading, setRsvpLoading] = useState(false);

  const handleSave = async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      if (saved) {
        await unsaveFlyer(flyer.id);
        setSaved(false);
      } else {
        await saveFlyer(flyer.id);
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
  if (!userEmail) return;
  setRsvpLoading(true);
  try {
    if (rsvped) {
      await unrsvpFlyer(flyer.id);
      setRsvped(false);
    } else {
      await rsvpFlyer(flyer.id);
      setRsvped(true);
    }
  } finally {
    setRsvpLoading(false);
  }
};

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const handleTogglePrivacy = async () => {
    setPrivacyLoading(true);
    try {
      const newValue = await toggleFlyerPrivacy(flyer.id);
      setIsPrivate(newValue);
    } finally {
      setPrivacyLoading(false);
    }
  };

  return (
  <div className="flyer-detail-note">
    <div className="flyer-pin pin-red" />
    <div className="flyer-note-corner-rainbow" />

    <span className="flyer-category-badge">{flyer.category}</span>
    <h1 className="flyer-detail-title">
      {flyer.title}
      {isOwner && isPrivate && <span className="flyer-private-badge">🔒 Private</span>}
    </h1>
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
      <Button className="flyer-btn-rsvp" onClick={handleRSVP}>RSVP</Button>
      <Button
          className={saved ? 'flyer-btn-unsave' : 'flyer-btn-save'}
          onClick={handleSave}
          disabled={loading || !userEmail}
        >
          {loading ? '...' : saved ? 'Unsave' : 'Save'}
        </Button>
      <Button className="flyer-btn-share" onClick={handleShare}>Share</Button>
      {isOwner && (
        <Button
          className={isPrivate ? 'flyer-btn-make-public' : 'flyer-btn-make-private'}
          onClick={handleTogglePrivacy}
          disabled={privacyLoading}
        >
          {privacyLoading ? '...' : isPrivate ? 'Make Public' : 'Make Private'}
        </Button>
      )}
    </div>
  </div>
  );
};

export default FlyerDetailCard;
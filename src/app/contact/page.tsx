'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, body }),
      });

      if (!res.ok) throw new Error('Failed');

      setName('');
      setEmail('');
      setSubject('');
      setBody('');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="contact-page">

      <div className="page-title-strip">
        <h1>Get In Touch!</h1>
      </div>

      <div className="section-label"><span>Meet the Team</span></div>
      <div className="cards-grid">

        <div className="contact-card">
          <div className="card-pin"></div>
          <img src="tamelaicon.jpg" alt="Tamela Brinson" className="contact-card-avatar-green" />
          <h3>Tamela Brinson</h3>
          <p className="contact-card-role">Lead Developer</p>
          <p>Questions about features, bugs, or technical issues? Tamela is your person.</p>
          <a href="mailto:tamelab@hawaii.edu" className="card-link link-green">tamelab@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <img src="thomasicon.jpg" alt="Thomas Tran" className="contact-card-avatar-yellow" />
          <h3>Thomas Tran</h3>
          <p className="contact-card-role">Content Curator</p>
          <p>Have a flyer to feature or content feedback? Thomas keeps the board organized and looking great.</p>
          <a href="mailto:tranthom@hawaii.edu" className="card-link link-yellow">tranthom@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <img src="annieicon.jpg" alt="Annie Pham" className="contact-card-avatar-red" />
          <h3>Annie Pham</h3>
          <p className="contact-card-role">Community Manager</p>
          <p>Reach out about events, partnerships, or getting your org on the board.</p>
          <a href="mailto:anniep7@hawaii.edu" className="card-link link-red">anniep7@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <img src="terisaicon.jpg" alt="Terisa Lau" className="contact-card-avatar-blue" />
          <h3>Terisa Lau</h3>
          <p className="contact-card-role">Project Manager</p>
          <p>General inquiries, collaborations, or anything else — Terisa&apos;s got you.</p>
          <a href="mailto:tlau6@hawaii.edu" className="card-link link-blue">tlau6@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <img src="cadenicon.jpg" alt="Caden Tran" className="contact-card-avatar-purple" />
          <h3>Caden Tran</h3>
          <p className="contact-card-role">Visual Designer</p>
          <p>Feedback on the look and feel of the site? Caden would love to hear it.</p>
          <a href="mailto:cadent4@hawaii.edu" className="card-link link-purple">cadent4@hawaii.edu</a>
        </div>

      </div>

      <div className="section-label"><span>Send a Message</span></div>
      <div className="form-card">
        <div className="card-pin"></div>
        <h2>Drop Us a Note</h2>

        {status === 'success' ? (
          <div className="contact-success-msg">
            <p>✓ Message sent! We&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="e.g. John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control-custom"
                placeholder="you@hawaii.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-control-custom"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-control-custom"
                placeholder="Write your message here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
              />
            </div>

            {status === 'error' && (
              <p className="auth-error">Something went wrong. Please try again.</p>
            )}

            <button type="submit" className="submit-btn" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}

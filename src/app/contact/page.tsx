'use client';

export default function ContactPage() {
  return (
    <div className="contact-page">

      {/* Page Title */}
      <div className="page-title-strip">
        <h1>Get In Touch</h1>
      </div>

      {/* Center Image */}
      <div className="center-image-wrap">
        <div className="center-image-card">
          <div className="card-pin"></div>
          <img
            src="/contactImage.jpg"
            alt="UH Manoa Campus"
          />
          <p className="img-caption">We&apos;d love to hear from the UH Mānoa community 🌺</p>
        </div>
      </div>

      {/* Team Cards */}
      <div className="section-label"><span>Meet the Team</span></div>
      <div className="cards-grid">

        <div className="contact-card">
          <div className="card-pin"></div>
          <div className="card-icon-circle icon-green">
            <i className="fa-solid fa-user"></i>
          </div>
          <h3>Tamela Brinson</h3>
          <p className="contact-card-role">Lead Developer</p>
          <p>Questions about features, bugs, or technical issues? Alex is your person.</p>
          <a href="mailto:alex@hawaii.edu" className="card-link link-green">alex@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <div className="card-icon-circle icon-yellow">
            <i className="fa-solid fa-user"></i>
          </div>
          <h3>Thomas Tran</h3>
          <p className="contact-card-role">Community Manager</p>
          <p>Reach out about events, partnerships, or getting your org on the board.</p>
          <a href="mailto:maya@hawaii.edu" className="card-link link-yellow">maya@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <div className="card-icon-circle icon-red">
            <i className="fa-solid fa-user"></i>
          </div>
          <h3>Annie Pham</h3>
          <p className="contact-card-role">Design Lead</p>
          <p>Feedback on the look and feel of the site? Jordan would love to hear it.</p>
          <a href="mailto:jordan@hawaii.edu" className="card-link link-red">jordan@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <div className="card-icon-circle icon-blue">
            <i className="fa-solid fa-user"></i>
          </div>
          <h3>Terisa Lau</h3>
          <p className="contact-card-role">Project Manager</p>
          <p>General inquiries, collaborations, or anything else — Sam&apos;s got you.</p>
          <a href="mailto:sam@hawaii.edu" className="card-link link-blue">sam@hawaii.edu</a>
        </div>

        <div className="contact-card">
          <div className="card-pin"></div>
          <div className="card-icon-circle icon-red">
            <i className="fa-solid fa-user"></i>
          </div>
          <h3>Caden Tran</h3>
          <p className="contact-card-role">Design Lead</p>
          <p>Feedback on the look and feel of the site? Jordan would love to hear it.</p>
          <a href="mailto:jordan@hawaii.edu" className="card-link link-red">jordan@hawaii.edu</a>
        </div>

      </div>

      {/* Contact Form */}
      <div className="section-label"><span>Send a Message</span></div>
      <div className="form-card">
        <div className="card-pin"></div>
        <h2>Drop Us a Note</h2>

        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input type="text" className="form-control-custom" placeholder="e.g. Kaimana Akana" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-control-custom" placeholder="you@hawaii.edu" />
        </div>
        <div className="form-group">
          <label className="form-label">Subject</label>
          <input type="text" className="form-control-custom" placeholder="What&apos;s this about?" />
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-control-custom" placeholder="Write your message here..." />
        </div>
        <button className="submit-btn">Send Message 📌</button>
      </div>

    </div>
  );
}

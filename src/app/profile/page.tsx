'use client';

import { ChangeEvent, useState } from 'react';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [email, setEmail] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [interests, setInterests] = useState({
    jobs: false,
    campusEvents: false,
    studyGroups: false,
    clubs: false,
  });

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setPhotoPreview(imageUrl);
  };

  const handleInterestChange = (name: keyof typeof interests) => {
    setInterests((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = () => {
    console.log({
      fullName,
      major,
      email,
      photoPreview,
      interests,
    });
  };

  return (
    <section className="profile-page">
      <div className="container py-5">
        <div className="profile-board mx-auto">
          <div className="profile-board-pin"></div>

          <div className="profile-header text-center">
            <h1 className="profile-title">Create Your Profile</h1>
            <p className="profile-subtitle">
              Welcome to Bow-lletins! Let&apos;s set up your profile so you can get
              personalized updates and opportunities.
            </p>
          </div>

          <div className="profile-body">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="profile-photo-section text-center">
                  <div className="profile-photo-circle mx-auto">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="profile-photo-preview"
                      />
                    ) : (
                      <span className="profile-photo-placeholder">Photo</span>
                    )}
                  </div>

                  <p className="profile-photo-label mt-3 mb-2">Upload Profile Photo</p>

                  <label className="btn profile-upload-btn" htmlFor="profilePhoto">
                    Upload Photo
                  </label>
                  <input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    hidden
                  />
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label profile-label">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-control profile-input"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="major" className="form-label profile-label">
                    Major
                  </label>
                  <select
                    id="major"
                    className="form-select profile-input"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  >
                    <option value="">Select Major</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information and Computer Sciences">
                      Information and Computer Sciences
                    </option>
                    <option value="Business">Business</option>
                    <option value="Biology">Biology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Psychology">Psychology</option>
                    <option value="English">English</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label profile-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control profile-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="profile-interests mt-4">
              <h3 className="profile-interests-title">Pick Interests to Follow:</h3>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="jobs"
                      checked={interests.jobs}
                      onChange={() => handleInterestChange('jobs')}
                    />
                    <label className="form-check-label" htmlFor="jobs">
                      Jobs
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="campus-events"
                      checked={interests.campusEvents}
                      onChange={() => handleInterestChange('campusEvents')}
                    />
                    <label className="form-check-label" htmlFor="campus-events">
                      Campus Events
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="study-groups"
                      checked={interests.studyGroups}
                      onChange={() => handleInterestChange('studyGroups')}
                    />
                    <label className="form-check-label" htmlFor="study-groups">
                      Study Groups
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="clubs"
                      checked={interests.clubs}
                      onChange={() => handleInterestChange('clubs')}
                    />
                    <label className="form-check-label" htmlFor="clubs">
                      Clubs & Organizations
                    </label>
                  </div>
                </div>
              </div>

              <p className="profile-interest-note">
                Based on your interests, we&apos;ll send you relevant opportunities and
                updates.
              </p>
            </div>

            <div className="text-center mt-4">
              <button className="btn profile-complete-btn" type="button" onClick={handleSubmit}>
                Complete Profile
              </button>
            </div>

            <p className="profile-policy text-center mt-4 mb-0">
              By creating a profile, you agree to our Privacy Policy and Terms of
              Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
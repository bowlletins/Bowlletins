export default function ProfilePage() {
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
                    <span className="profile-photo-placeholder">Photo</span>
                  </div>
                  <p className="profile-photo-label mt-3 mb-2">Upload Profile Photo</p>
                  <button className="btn profile-upload-btn" type="button">
                    Upload Photo
                  </button>
                </div>
              </div>

              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label profile-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control profile-input"
                    placeholder="Tamela Brinson"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label profile-label">Major</label>
                  <select className="form-select profile-input">
                    <option>Select Major</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label profile-label">Email</label>
                  <input
                    type="email"
                    className="form-control profile-input"
                    placeholder="tamela.brinson@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="profile-interests mt-4">
              <h3 className="profile-interests-title">Pick Interests to Follow:</h3>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="jobs" />
                    <label className="form-check-label" htmlFor="jobs">
                      Jobs
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="campus-events" />
                    <label className="form-check-label" htmlFor="campus-events">
                      Campus Events
                    </label>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="study-groups" />
                    <label className="form-check-label" htmlFor="study-groups">
                      Study Groups
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="clubs" />
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
              <button className="btn profile-complete-btn" type="button">
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
'use client';

import { ChangeEvent, useState } from 'react';
import { updateProfile } from '@/lib/dbActions';
import { Major } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type SessionUser = {
  email: string;
  id: string;
  name: string;
  username: string;
  usernameUpdatedAt?: string | Date | null;
  useFullNameDisplay?: boolean;
  major: Major;
  image: string;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const USERNAME_LOCK_DAYS = 30;
const CURRENT_TIME = new Date().getTime();

export default function ProfileSettings({ user }: { user: SessionUser }) {
  const { update } = useSession();
  const router = useRouter();

  const [fullName, setFullName] = useState(user.name ?? '');
  const [username, setUsername] = useState(user.username ?? '');
  const [useFullNameDisplay, setUseFullNameDisplay] = useState(user.useFullNameDisplay ?? false);
  const [major, setMajor] = useState<string>(user.major ?? 'Other');
  const [photoPreview, setPhotoPreview] = useState<string | null>(user.image || null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const usernameLastChanged = user.usernameUpdatedAt
    ? new Date(user.usernameUpdatedAt)
    : null;

  const daysSinceUsernameChange = usernameLastChanged
    ? (CURRENT_TIME - usernameLastChanged.getTime()) / MS_PER_DAY
    : USERNAME_LOCK_DAYS;

  const usernameLocked = daysSinceUsernameChange < USERNAME_LOCK_DAYS;

  const usernameDaysLeft = usernameLocked
    ? Math.ceil(USERNAME_LOCK_DAYS - daysSinceUsernameChange)
    : 0;

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    const newName = fullName.trim() || null;
    const newUsername = username.trim().toLowerCase();
    const usernameChanged = newUsername !== user.username;
    const displayPreferenceChanged = useFullNameDisplay !== (user.useFullNameDisplay ?? false);
    const newMajor = major !== user.major ? (major as Major) : null;
    const newImage = photoBase64 ?? null;

    if (
      !newName
      && !usernameChanged
      && !displayPreferenceChanged
      && !newMajor
      && newImage === null
    ) {
      router.push('/homeDashboard');
      return;
    }

    try {
await updateProfile({
  email: user.email,
  username: usernameChanged ? newUsername : undefined,
  fullName: newName ?? undefined,
  useFullNameDisplay,
  major: newMajor ?? undefined,
  image: newImage ?? undefined,
});

      await update({
        name: useFullNameDisplay
          ? newName ?? user.name
          : usernameChanged ? newUsername : user.username,
        username: usernameChanged ? newUsername : undefined,
        useFullNameDisplay,
        major: newMajor ?? user.major,
      });

      setSuccess(true);
      router.push('/homeDashboard');
      router.refresh();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'There was an error updating your profile. Please try again.',
      );
    }
  };

  return (
    <section className="profile-page">
      <div className="container py-5">
        <div className="profile-board mx-auto">
          <div className="profile-board-pin" />

          <div className="profile-header text-center">
            <h1 className="profile-title">Edit Your Profile</h1>
            <p className="profile-subtitle">
              All fields are optional — only changes will be saved.
            </p>
          </div>

          <div className="profile-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Profile updated successfully!</div>}

            <div className="row g-4">
              <div className="col-md-4">
                <div className="profile-photo-section text-center">
                  <div className="profile-photo-circle mx-auto">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile preview" className="profile-photo-preview" />
                    ) : (
                      <span className="profile-photo-placeholder">Photo</span>
                    )}
                  </div>

                  <p className="profile-photo-label mt-3 mb-2">Upload Profile Photo</p>

                  <label className="btn profile-upload-btn" htmlFor="profilePhoto">
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
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
                  <label className="form-label profile-label">Email</label>
                  <input
                    type="email"
                    className="form-control profile-input"
                    value={user.email}
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed.</small>
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label profile-label">
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    className="form-control profile-input"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={usernameLocked}
                    required
                  />

                  <small className={usernameLocked ? 'text-danger' : 'text-muted'}>
                    {usernameLocked
                      ? `Username locked. You can change it again in ${usernameDaysLeft} day(s).`
                      : 'You can only change your username once every 30 days.'}
                  </small>
                </div>

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

                <div className="form-check mb-3">
                  <input
                    id="useFullNameDisplay"
                    type="checkbox"
                    className="form-check-input"
                    checked={useFullNameDisplay}
                    onChange={(e) => setUseFullNameDisplay(e.target.checked)}
                  />
                  <label htmlFor="useFullNameDisplay" className="form-check-label profile-label">
                    Use my full name as my display name
                  </label>
                  <br />
                  <small className="text-muted">
                    If unchecked, your username will be shown instead.
                  </small>
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
                    <option value="Computer_Science">Computer Science</option>
                    <option value="Business">Business</option>
                    <option value="Biology">Biology</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Psychology">Psychology</option>
                    <option value="English">English</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn profile-complete-btn" type="button" onClick={handleSubmit}>
                Save Changes
              </button>
            </div>

            <p className="profile-policy text-center mt-4 mb-0">
              By updating your profile, you agree to our Privacy Policy and Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
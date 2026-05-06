'use client';

import { ChangeEvent, useState } from 'react';
import { changePassword, updateProfile } from '@/lib/dbActions';
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

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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

  const handlePasswordChange = async () => {
    setPasswordMessage(null);
    setPasswordError(null);

    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill out both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      await changePassword({
        email: user.email,
        password: newPassword,
      });

      setNewPassword('');
      setConfirmPassword('');
      setPasswordMessage('Password updated successfully.');
    } catch (err) {
      setPasswordError(
        err instanceof Error
          ? err.message
          : 'There was an error updating your password.',
      );
    }
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
              Update your account information, display preferences, and password.
            </p>
          </div>

          <div className="profile-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">Profile updated successfully!</div>}

            <div className="row g-4 align-items-start">
              <div className="col-lg-4">
                <div className="profile-form-section profile-photo-card text-center">
                  <h3 className="profile-section-title">Profile Photo</h3>

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

                  <p className="text-muted small mt-3 mb-0">
                    This image will show on your dashboard profile card.
                  </p>
                </div>
              </div>

              <div className="col-lg-8">
                <div className="profile-form-section">
                  <h3 className="profile-section-title">Account Information</h3>

                  <div className="profile-form-row">
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

                  <div className="profile-form-row">
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
                  </div>

                  <div className="profile-display-option">
                    <div className="form-check mb-0">
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
                    </div>
                    <small className="text-muted">
                      If unchecked, your username will be shown instead.
                    </small>
                  </div>
                </div>

                <div className="profile-form-section mt-4">
                  <h3 className="profile-section-title">Security</h3>
                  <p className="text-muted small">
                    Password must be at least 8 characters and include uppercase, lowercase,
                    number, and special character.
                  </p>

                  {passwordMessage && <div className="alert alert-success">{passwordMessage}</div>}
                  {passwordError && <div className="alert alert-danger">{passwordError}</div>}

                  <div className="profile-form-row">
                    <div className="mb-3">
                      <label htmlFor="newPassword" className="form-label profile-label">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        className="form-control profile-input"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label profile-label">
                        Confirm Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        className="form-control profile-input"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <button
                    className="btn profile-password-btn"
                    type="button"
                    onClick={handlePasswordChange}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-actions-bar">
              <button className="btn profile-complete-btn" type="button" onClick={handleSubmit}>
                Save Profile Changes
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
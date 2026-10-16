import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';
import { updateProfile, updateProfileImage } from '../services/userService';
import { extractErrorMessage } from '../services/api';

const EditProfile = () => {
  const { user, updateStoredUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let latest = user;
      if (name !== user.name || phone !== (user.phone || '')) {
        const { data } = await updateProfile({ name, phone });
        latest = data.user;
      }
      if (file) {
        const { data } = await updateProfileImage(file);
        latest = data.user;
      }
      updateStoredUser(latest);
      navigate('/profile');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="card mx-auto max-w-md p-6 sm:p-8">
        <h1 className="mb-6 text-3xl font-extrabold">Edit profile</h1>

        {error && (
          <div className="alert-error mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : user.profileImage?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4338f0&color=fff&bold=true&size=128`
              }
              alt={user.name}
              className="mb-4 h-28 w-28 rounded-full object-cover ring-4 ring-brand-100"
            />
            <label className="btn-secondary cursor-pointer">
              Change photo
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>

          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input
              id="name"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="phone" className="label">
              Mobile number
            </label>
            <input
              id="phone"
              type="tel"
              required
              placeholder="+919876543210"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary w-full !py-3" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProfile;

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Avatar from '../components/Avatar';
import { getUserById } from '../services/userService';
import { extractErrorMessage } from '../services/api';

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getUserById(id)
      .then(({ data }) => setUser(data.user))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  if (error || !user) {
    return (
      <MainLayout>
        <ErrorState message={error || 'User not found'} onRetry={load} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="card mx-auto max-w-md overflow-hidden text-center">
        <div className="h-28 bg-ink bg-[radial-gradient(circle_at_20%_20%,#4338f0_0,transparent_55%),radial-gradient(circle_at_85%_90%,rgba(255,194,51,.45)_0,transparent_45%)]" />
        <div className="px-6 pb-8">
        <Avatar person={user} size={104} className="-mt-14 mx-auto !ring-4" />
        <h1 className="mt-4 text-2xl font-extrabold">{user.name}</h1>
        <p className="mt-1 text-xs text-ink-mute">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublicProfile;

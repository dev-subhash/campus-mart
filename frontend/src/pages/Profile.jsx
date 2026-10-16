import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="card mx-auto max-w-md overflow-hidden text-center">
        <div className="h-28 bg-ink bg-[radial-gradient(circle_at_20%_20%,#4338f0_0,transparent_55%),radial-gradient(circle_at_85%_90%,rgba(255,194,51,.45)_0,transparent_45%)]" />
        <div className="px-6 pb-8">
        <Avatar person={user} size={104} className="-mt-14 mx-auto !ring-4" />
        <h1 className="mt-4 text-2xl font-extrabold">{user.name}</h1>
        <p className="text-sm text-ink-soft">{user.email}</p>
        <p className="mt-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold capitalize text-brand-700">{user.role} account</p>
        <p className="mt-2 text-xs text-ink-mute">
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <div className="mt-7 flex gap-3">
          <Link to="/profile/edit" className="btn-secondary flex-1 !py-3">
            Edit profile
          </Link>
          <Link to="/my-listings" className="btn-primary flex-1 !py-3">
            My listings
          </Link>
        </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;

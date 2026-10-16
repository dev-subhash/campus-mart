import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProductGrid from '../components/ProductGrid';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getMyListings } from '../services/userService';
import { extractErrorMessage } from '../services/api';

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getMyListings()
      .then(({ data }) => setProducts(data.products))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold sm:text-4xl">My listings</h1>
        <Link to="/products/new" className="btn-primary">
          + New listing
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ProductGrid products={products} />
      )}
    </MainLayout>
  );
};

export default MyListings;

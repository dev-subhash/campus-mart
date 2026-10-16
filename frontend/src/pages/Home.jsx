import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../components/SearchBar';
import ProductGrid from '../components/ProductGrid';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getProducts, CATEGORIES } from '../services/productService';
import { extractErrorMessage } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    getProducts({ limit: 8, sort: 'newest' })
      .then(({ data }) => setProducts(data.products))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <MainLayout>
      <section className="animate-rise overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff4dc] via-white to-brand-100 px-6 py-10 sm:px-12 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600">Campus styles, student prices</p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-[1.02] sm:text-6xl">
              Everything your campus life needs.
            </h1>
            <p className="mt-5 max-w-lg text-base text-ink-soft sm:text-lg">
              Discover pre-loved books, gadgets, furniture, and everyday essentials from students around you.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar onSearch={(q) => navigate(`/products?search=${encodeURIComponent(q)}`)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="category-art category-art-blue row-span-2 flex min-h-64 flex-col justify-end rounded-[1.75rem] p-5 text-white">
              <span className="text-5xl">📚</span>
              <p className="mt-auto text-xl font-extrabold">Study essentials</p>
              <p className="text-sm text-white/75">Books, notes & stationery</p>
            </div>
            <div className="category-art category-art-yellow flex min-h-32 flex-col justify-end rounded-[1.75rem] p-4 text-ink">
              <span className="text-4xl">🎧</span>
              <p className="mt-auto font-extrabold">Tech finds</p>
            </div>
            <div className="category-art category-art-green flex min-h-32 flex-col justify-end rounded-[1.75rem] p-4 text-ink">
              <span className="text-4xl">🪑</span>
              <p className="mt-auto font-extrabold">Room refresh</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-600">Browse the edit</p>
            <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">Shop by category</h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-brand-600 hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className={`category-tile category-tile-${index % 5} group`}
            >
              <span className="text-3xl transition group-hover:scale-110">{['📚', '💻', '🛋️', '📝', '✏️', '🏠', '✨'][index]}</span>
              <span className="mt-3 text-sm font-bold">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Latest listings</h2>
          <Link to="/products" className="text-sm font-bold text-brand-600 hover:text-brand-800 hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </MainLayout>
  );
};

export default Home;

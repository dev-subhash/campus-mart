import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ProductGrid from '../components/ProductGrid';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getProducts } from '../services/productService';
import { extractErrorMessage } from '../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const filters = Object.fromEntries(searchParams.entries());

  const load = () => {
    setLoading(true);
    setError('');
    getProducts(filters)
      .then(({ data }) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilters = (next) => {
    const cleaned = Object.fromEntries(
      Object.entries(next).filter(([, v]) => v !== undefined && v !== '')
    );
    setSearchParams(cleaned);
  };

  const goToPage = (page) => updateFilters({ ...filters, page });

  return (
    <MainLayout>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-600">Discover on Campus Mart</p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
          {filters.search ? `Results for “${filters.search}”` : filters.category || 'All listings'}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">Find useful things from students in your campus community.</p>
      </div>
      <div className="mb-8 max-w-3xl">
        <SearchBar
          initialValue={filters.search || ''}
          onSearch={(q) => updateFilters({ ...filters, search: q, page: undefined })}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <FilterPanel
            filters={filters}
            onChange={(next) => updateFilters({ ...next, page: undefined })}
          />
        </aside>

        <div className="lg:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-soft">
              {pagination ? `${pagination.total} ${pagination.total === 1 ? 'item' : 'items'} found` : 'Latest listings'}
            </p>
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-ink-soft ring-1 ring-ink/10">
              {filters.sort === 'price_asc' ? 'Price: low to high' : filters.sort === 'price_desc' ? 'Price: high to low' : 'Recommended'}
            </span>
          </div>
          {loading ? (
            <Loading />
          ) : error ? (
            <ErrorState message={error} onRetry={load} />
          ) : (
            <>
              <ProductGrid products={products} />
              {pagination && pagination.pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    className="btn-secondary"
                    disabled={pagination.page <= 1}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-sm font-semibold text-ink-soft">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    className="btn-secondary"
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Products;

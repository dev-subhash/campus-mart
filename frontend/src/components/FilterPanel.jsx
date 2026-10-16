import { CATEGORIES, CONDITIONS } from '../services/productService';
import { SlidersIcon } from './Icons';

const FilterPanel = ({ filters, onChange }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="card space-y-4 p-5 md:sticky md:top-24">
      <div className="flex items-center gap-2 font-display text-base font-bold">
        <SlidersIcon size={16} className="text-brand-600" />
        Filters
      </div>
      <div>
        <label className="label" htmlFor="category">
          Category
        </label>
        <select
          id="category"
          className="input"
          value={filters.category || ''}
          onChange={(e) => update('category', e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="condition">
          Condition
        </label>
        <select
          id="condition"
          className="input"
          value={filters.condition || ''}
          onChange={(e) => update('condition', e.target.value)}
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label" htmlFor="minPrice">
            Min price
          </label>
          <input
            id="minPrice"
            type="number"
            min="0"
            className="input"
            value={filters.minPrice || ''}
            onChange={(e) => update('minPrice', e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="maxPrice">
            Max price
          </label>
          <input
            id="maxPrice"
            type="number"
            min="0"
            className="input"
            value={filters.maxPrice || ''}
            onChange={(e) => update('maxPrice', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="sort">
          Sort by
        </label>
        <select
          id="sort"
          className="input"
          value={filters.sort || 'newest'}
          onChange={(e) => update('sort', e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <button
        type="button"
        className="btn-secondary w-full"
        onClick={() => onChange({ search: filters.search })}
      >
        Clear filters
      </button>
    </div>
  );
};

export default FilterPanel;

import { useState } from 'react';
import { SearchIcon } from './Icons';

const SearchBar = ({ initialValue = '', onSearch }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl bg-white p-1.5 shadow-soft ring-1 ring-ink/10 transition focus-within:ring-2 focus-within:ring-brand-500"
    >
      <SearchIcon size={20} className="ml-3 shrink-0 text-ink-mute" />
      <input
        type="text"
        className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-ink placeholder:text-ink-mute focus:outline-none"
        placeholder="Search for textbooks, electronics, furniture..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search products"
      />
      <button type="submit" className="btn-primary shrink-0 !rounded-xl">
        Search
      </button>
    </form>
  );
};

export default SearchBar;

import { useState } from 'react';
import { CATEGORIES, CONDITIONS } from '../services/productService';

const ProductForm = ({ initialValues, onSubmit, submitLabel = 'Save' }) => {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    price: initialValues?.price || '',
    category: initialValues?.category || CATEGORIES[0],
    condition: initialValues?.condition || CONDITIONS[2],
    location: initialValues?.location || '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!initialValues && images.length === 0) {
      setError('Please add at least one product image');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...form, images });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card max-w-xl space-y-5 p-6 sm:p-8">
      {error && (
        <div className="alert-error">{error}</div>
      )}

      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        <input
          id="title"
          required
          className="input"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          required
          rows={5}
          className="input"
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price" className="label">
            Price (₹)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            required
            className="input"
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="condition" className="label">
            Condition
          </label>
          <select
            id="condition"
            className="input"
            value={form.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="label">
          Category
        </label>
        <select
          id="category"
          className="input"
          value={form.category}
          onChange={(e) => handleChange('category', e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className="label">
          Location (optional)
        </label>
        <input
          id="location"
          className="input"
          placeholder="e.g. Block C Hostel"
          value={form.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="images" className="label">
          {initialValues ? 'Add more images (optional)' : 'Images'}
        </label>
        <input
          id="images"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="input"
          onChange={(e) => setImages(e.target.files)}
        />
        <p className="mt-1.5 text-xs text-ink-mute">Up to 6 images, JPG/PNG/WEBP, 5MB max each.</p>
      </div>

      <button type="submit" className="btn-primary w-full !py-3" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default ProductForm;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProductForm from '../components/ProductForm';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getProductById, updateProduct, deleteProductImage } from '../services/productService';
import { extractErrorMessage } from '../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    getProductById(id)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (payload) => {
    const { data } = await updateProduct(id, payload);
    navigate(`/products/${data.product._id}`);
  };

  const handleRemoveImage = async (publicId) => {
    const { data } = await deleteProductImage(id, publicId);
    setProduct(data.product);
  };

  if (loading) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  if (error || !product) {
    return (
      <MainLayout>
        <ErrorState message={error || 'Product not found'} onRetry={load} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl">Edit listing</h1>

      {product.images?.length > 0 && (
        <div className="mb-6 flex max-w-xl flex-wrap gap-3">
          {product.images.map((img) => (
            <div key={img.publicId} className="relative">
              <img src={img.url} alt="" className="h-20 w-20 rounded-xl object-cover ring-1 ring-ink/10" />
              <button
                type="button"
                onClick={() => handleRemoveImage(img.publicId)}
                disabled={product.images.length <= 1}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-white shadow-soft transition hover:bg-rose-600 disabled:opacity-40"
                title={product.images.length <= 1 ? 'At least one image is required' : 'Remove image'}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <ProductForm initialValues={product} onSubmit={handleSubmit} submitLabel="Save changes" />
    </MainLayout>
  );
};

export default EditProduct;

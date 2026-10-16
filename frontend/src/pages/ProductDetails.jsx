import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import { PinIcon, ImageIcon, ChatIcon } from '../components/Icons';
import { useAuth } from '../context/AuthContext';
import { getProductById, deleteProduct } from '../services/productService';
import { findOrCreateConversation } from '../services/chatService';
import { extractErrorMessage } from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [contacting, setContacting] = useState(false);
  const listingCreated = location.state?.listingCreated;

  const load = () => {
    setLoading(true);
    setError('');
    getProductById(id)
      .then(({ data }) => setProduct(data.product))
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isOwner = user && product && product.seller._id === user._id;
  const canManage = isOwner || user?.role === 'admin';

  const handleContactSeller = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setContacting(true);
    try {
      const { data } = await findOrCreateConversation(product.seller._id, product._id);
      navigate('/chat', { state: { conversationId: data.conversation._id } });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setContacting(false);
    }
  };

  const handleDelete = async () => {
    await deleteProduct(id);
    navigate('/my-listings');
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
      {listingCreated && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
          Your product is listed successfully.
        </div>
      )}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-14">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-brand-50 ring-1 ring-ink/[.06]">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage].url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-300">
                <ImageIcon size={40} />
                <span className="text-sm font-semibold">No image</span>
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="scroll-quiet mt-3 flex gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImage(i)}
                  className={`h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    i === activeImage ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{product.title}</h1>
          <div className="mt-4">
            <span className="price-tag text-3xl">₹{product.price}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-white px-3 py-1.5 font-semibold text-ink-soft ring-1 ring-ink/10">
              Condition: {product.condition}
            </span>
            {product.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 font-semibold text-ink-soft ring-1 ring-ink/10">
                <PinIcon size={14} className="text-brand-600" />
                {product.location}
              </span>
            )}
          </div>

          <p className="mt-6 max-w-prose whitespace-pre-wrap leading-relaxed text-ink-soft">{product.description}</p>

          <div className="card mt-8 flex items-center gap-3.5 p-4">
            <Avatar person={product.seller} size={46} ring={false} />
            <div>
              <p className="text-sm font-bold">{product.seller.name}</p>
              <Link
                to={`/users/${product.seller._id}`}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                View profile
              </Link>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            {canManage ? (
              <>
                <Link to={`/products/${id}/edit`} className="btn-secondary flex-1 text-center !py-3">
                  Edit listing
                </Link>
                <button className="btn-danger flex-1 !py-3" onClick={() => setConfirmOpen(true)}>
                  Delete
                </button>
              </>
            ) : (
              <button className="btn-primary flex-1 !py-3.5 text-base" onClick={handleContactSeller} disabled={contacting}>
                <ChatIcon size={18} />
                {contacting ? 'Opening chat...' : 'Chat with seller'}
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this listing?"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm">
          This action cannot be undone. The listing and its images will be permanently removed.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default ProductDetails;

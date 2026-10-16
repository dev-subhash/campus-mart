import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProductForm from '../components/ProductForm';
import { createProduct } from '../services/productService';

const CreateProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const { data } = await createProduct(payload);
    navigate(`/products/${data.product._id}`, {
      state: { listingCreated: true },
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-marigold/20 px-4 py-8 shadow-soft sm:px-8 sm:py-10">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">Sell on Campus Mart</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Create a new listing</h1>
          <p className="mt-2 text-sm text-ink-soft">Give your item a great description and help it find a new home.</p>
        </div>
        <div className="mx-auto mt-7 max-w-xl">
          <ProductForm onSubmit={handleSubmit} submitLabel="Publish listing" />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateProduct;

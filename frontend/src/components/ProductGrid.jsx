import ProductCard from './ProductCard';
import EmptyState from './EmptyState';

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return <EmptyState title="No products found" description="Try adjusting your search or filters." />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;

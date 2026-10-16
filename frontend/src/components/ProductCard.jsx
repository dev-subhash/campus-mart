import { Link } from 'react-router-dom';
import { ImageIcon } from './Icons';

const ProductCard = ({ product }) => {
  const image = product.images?.[0]?.url;

  return (
    <Link to={`/products/${product._id}`} className="group block rounded-2xl focus-visible:ring-offset-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-50 ring-1 ring-ink/[.06]">
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-300">
            <ImageIcon size={32} />
            <span className="text-xs font-semibold">No image</span>
          </div>
        )}
        <span className="price-tag absolute bottom-3 left-3 text-base shadow-sm">₹{product.price}</span>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-ink backdrop-blur">
          {product.condition}
        </span>
      </div>
      <div className="px-1 pt-3">
        <p className="truncate font-semibold text-ink group-hover:text-brand-700">{product.title}</p>
        <p className="mt-0.5 text-xs font-medium text-ink-mute">{product.category}</p>
      </div>
    </Link>
  );
};

export default ProductCard;

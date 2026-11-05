import { Link } from "react-router-dom";
import StarRating from "./StarRating";

function ProductListingCard({ id, price, rating, title, thumbnail }) {
  return (
    <Link
      to={`/product/${id}`}
      className="block rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <img src={thumbnail} alt={title} className="h-44 w-full object-contain" />
      <hr className="my-3 border-gray-100" />
      <h2 className="truncate text-lg font-medium text-gray-900">{title}</h2>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-lg font-bold text-gray-900">${price}</p>
        <StarRating rating={rating} />
      </div>
    </Link>
  );
}

export default ProductListingCard;

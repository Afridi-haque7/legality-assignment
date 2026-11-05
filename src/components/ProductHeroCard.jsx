import { useState } from "react";
import BackButton from "./BackButton";
import Pagination from "./Pagination";
import StarRating from "./StarRating";

function ProductHeroCard({ product }) {
  const [imagePage, setImagePage] = useState(1);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:gap-10 md:p-8">
      {/* Image section */}
      <div className="flex flex-col border-gray-200 md:border-r md:pr-10">
        <BackButton className="self-start" />
        <div className="flex flex-1 items-center justify-center py-6">
          <img
            src={product.images[imagePage - 1]}
            alt={product.title}
            className="h-64 w-full object-contain md:h-96"
          />
        </div>
        <Pagination
          currentPage={imagePage}
          totalPages={product.images.length}
          onPageChange={setImagePage}
        />
      </div>

      {/* Product details section */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            {product.title}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <p className="text-2xl font-bold text-gray-900 md:text-3xl">
              ${product.price}
            </p>
            <StarRating rating={product.rating} />
          </div>
          <div className="mt-4 space-y-1 text-gray-700">
            {product.brand && (
              <p>
                <span className="font-semibold text-gray-900">Brand:</span>{" "}
                {product.brand}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-900">Category:</span>{" "}
              <span className="capitalize">
                {product.category.replaceAll("-", " ")}
              </span>
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Description</h2>
          <p className="mt-2 leading-relaxed text-gray-700">
            {product.description}
          </p>
        </div>

        <hr className="border-gray-200" />

        <div>
          <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
          {product.reviews?.length ? (
            <ul className="mt-3 space-y-5">
              {product.reviews.map((review, index) => (
                <li key={index}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {review.reviewerName}
                    </h3>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-1 text-gray-700">{review.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductHeroCard;

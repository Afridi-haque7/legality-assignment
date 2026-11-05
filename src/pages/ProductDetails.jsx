import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductHeroCard from "../components/ProductHeroCard";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { fetchProduct } from "../api";

function ProductDetails() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetchProduct(id)
      .then((product) => {
        if (!ignore) setResult({ id, product });
      })
      .catch((error) => {
        console.error({ error });
        if (!ignore) setResult({ id, error });
      });
    return () => {
      ignore = true;
    };
  }, [id, retryCount]);

  const handleRetry = () => {
    setResult(null);
    setRetryCount((count) => count + 1);
  };

  if (result?.id !== id) return <p className="p-4 md:p-8">Loading...</p>;

  if (result.error) {
    const isNotFound = result.error.status === 404;
    return (
      <div className="px-4 py-16 text-center">
        <p className="text-gray-700">
          {isNotFound
            ? "We couldn't find this product."
            : "Something went wrong while loading this product."}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <BackButton />
          {!isNotFound && <Button onClick={handleRetry}>Try again</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl">
      <ProductHeroCard product={result.product} />
    </div>
  );
}

export default ProductDetails;

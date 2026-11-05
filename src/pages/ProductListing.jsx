import { useState, useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import ProductListingCard from "../components/ProductListingCard";
import Pagination from "../components/Pagination";
import FilterSection from "../components/FilterSection";
import Button from "../components/Button";
import { fetchProducts } from "../api";

const PRODUCTS_PER_PAGE = 12;
const gridClass =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function ProductListing() {
  const { isFilterOpen } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Filters live in the URL, so they survive a refresh and the details page's Back button
  const filters = {
    categories: searchParams.getAll("category"),
    brands: searchParams.getAll("brand"),
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    search: searchParams.get("q") ?? "",
  };

  const categoriesKey = filters.categories.join(",");
  const isLoading = result?.categoriesKey !== categoriesKey;

  useEffect(() => {
    let ignore = false;
    fetchProducts(categoriesKey ? categoriesKey.split(",") : [])
      .then((products) => {
        if (!ignore) setResult({ categoriesKey, products });
      })
      .catch((error) => {
        console.error({ error });
        if (!ignore) setResult({ categoriesKey, products: [], error });
      });
    return () => {
      ignore = true;
    };
  }, [categoriesKey, retryCount]);

  const products = isLoading ? [] : result.products;
  const brandOptions = [
    ...new Set(products.map((product) => product.brand).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b));
  const searchTerm = filters.search.toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      (!searchTerm || product.title.toLowerCase().includes(searchTerm)) &&
      (!filters.brands.length || filters.brands.includes(product.brand)) &&
      (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
      (!filters.maxPrice || product.price <= Number(filters.maxPrice)),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const requestedPage = Number.parseInt(searchParams.get("page"), 10) || 1;
  const currentPage = Math.min(Math.max(requestedPage, 1), totalPages);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  // Building the params from scratch leaves out "page", so any filter change goes back to page 1
  const handleFiltersChange = ({
    categories,
    brands,
    minPrice,
    maxPrice,
    search,
  }) => {
    const params = new URLSearchParams();
    categories.forEach((category) => params.append("category", category));
    brands.forEach((brand) => params.append("brand", brand));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (search) params.set("q", search);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    setSearchParams((params) => {
      params.set("page", page);
      return params;
    });
    window.scrollTo({ top: 0 });
  };

  const handleRetry = () => {
    setResult(null);
    setRetryCount((count) => count + 1);
  };

  const renderProducts = () => {
    if (isLoading) {
      return (
        <div className={gridClass}>
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="h-72 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      );
    }

    if (result.error) {
      return (
        <div className="py-16 text-center">
          <p className="text-gray-700">
            Something went wrong while loading products.
          </p>
          <Button onClick={handleRetry} className="mt-4">
            Try again
          </Button>
        </div>
      );
    }

    if (!filteredProducts.length) {
      return (
        <div className="py-16 text-center">
          <p className="text-gray-700">
            No products match your search and filters.
          </p>
          <Button onClick={() => setSearchParams({})} className="mt-4">
            Clear filters
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className={gridClass}>
          {pageProducts.map((product) => (
            <ProductListingCard
              key={product.id}
              id={product.id}
              price={product.price}
              rating={product.rating}
              title={product.title}
              thumbnail={product.thumbnail}
            />
          ))}
        </div>
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  };

  return (
    <div className="flex w-full flex-col md:flex-row">
      <FilterSection
        isOpen={isFilterOpen}
        filters={filters}
        brands={brandOptions}
        isLoadingBrands={isLoading}
        onFiltersChange={handleFiltersChange}
      />
      <section className="min-w-0 flex-1 p-4 md:p-8">
        <h1 className="mb-4 text-2xl font-bold">Product Listing</h1>
        {renderProducts()}
      </section>
    </div>
  );
}

export default ProductListing;

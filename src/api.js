const BASE_URL = "https://dummyjson.com";

// Only what the listing card and the brand filter need, which keeps the full catalog small
const LISTING_FIELDS = "title,price,rating,thumbnail,brand";

class ApiError extends Error {
  constructor(path, status) {
    super(`Request to ${path} failed with status ${status}`);
    this.status = status;
  }
}

const responseCache = new Map();

async function fetchJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new ApiError(path, response.status);
  }
  return response.json();
}

function fetchCachedJson(path) {
  if (!responseCache.has(path)) {
    const request = fetchJson(path).catch((error) => {
      responseCache.delete(path);
      throw error;
    });
    responseCache.set(path, request);
  }
  return responseCache.get(path);
}

export function fetchCategories() {
  return fetchCachedJson("/products/categories");
}

export function fetchProduct(id) {
  return fetchCachedJson(`/products/${encodeURIComponent(id)}`);
}

// The API can't filter by price or brand, so this loads every product in the selected
// categories (limit=0) and the listing page filters and paginates them itself
export async function fetchProducts(categories) {
  const paths = categories.length
    ? categories.map(
        (category) =>
          `/products/category/${category}?limit=0&select=${LISTING_FIELDS}`,
      )
    : [`/products?limit=0&select=${LISTING_FIELDS}`];
  const results = await Promise.all(paths.map(fetchCachedJson));
  return results
    .flatMap((result) => result.products)
    .sort((a, b) => a.id - b.id);
}

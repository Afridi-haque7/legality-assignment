import { useState, useEffect } from "react";
import { fetchCategories } from "../api";

const PRICE_DEBOUNCE_MS = 400;

const headingClass = "text-lg font-semibold text-gray-900";
const statusClass = "mt-3 text-sm text-gray-500";
const inputClass =
  "w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 py-2 outline-none focus:border-blue-500";

const toggle = (list, value) =>
  list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];

function CheckboxList({ options, selected, onToggle }) {
  return (
    <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
      {options.map((option) => (
        <li key={option.value}>
          <label className="flex cursor-pointer items-center gap-3 text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 cursor-pointer accent-blue-500"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            {option.label}
          </label>
        </li>
      ))}
    </ul>
  );
}

function PriceFilter({ minPrice, maxPrice, onChange }) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const [syncedPrice, setSyncedPrice] = useState({ minPrice, maxPrice });

  if (syncedPrice.minPrice !== minPrice || syncedPrice.maxPrice !== maxPrice) {
    setSyncedPrice({ minPrice, maxPrice });
    setMin(minPrice);
    setMax(maxPrice);
  }

  const isRangeInvalid = min !== "" && max !== "" && Number(min) > Number(max);
  const isPending = min !== minPrice || max !== maxPrice;

  useEffect(() => {
    if (isRangeInvalid || !isPending) return;
    const timeout = setTimeout(() => onChange(min, max), PRICE_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [min, max, isRangeInvalid, isPending, onChange]);

  return (
    <div className="mt-3 space-y-3">
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          placeholder="Min"
          aria-label="Minimum price"
          value={min}
          onChange={(event) => setMin(event.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          min="0"
          placeholder="Max"
          aria-label="Maximum price"
          value={max}
          onChange={(event) => setMax(event.target.value)}
          className={inputClass}
        />
      </div>
      {isRangeInvalid && (
        <p className="text-sm text-red-600">
          Min price can't be more than max price.
        </p>
      )}
    </div>
  );
}

function FilterSection({
  isOpen,
  filters,
  brands,
  isLoadingBrands,
  onFiltersChange,
}) {
  const [categories, setCategories] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetchCategories()
      .then((data) => {
        if (!ignore) setCategories(data);
      })
      .catch((error) => {
        console.error({ error });
        if (!ignore) setCategoriesError(error);
      });
    return () => {
      ignore = true;
    };
  }, []);

  // Brand options come from the selected categories' products, so a category change clears brands
  const handleCategoryToggle = (slug) =>
    onFiltersChange({
      ...filters,
      categories: toggle(filters.categories, slug),
      brands: [],
    });

  const handleBrandToggle = (brand) =>
    onFiltersChange({ ...filters, brands: toggle(filters.brands, brand) });

  const handlePriceChange = (minPrice, maxPrice) =>
    onFiltersChange({ ...filters, minPrice, maxPrice });

  return (
    // Hidden rather than unmounted, so categories aren't refetched every time it opens
    <aside
      id="filter-menu"
      hidden={!isOpen}
      className="w-full shrink-0 border-b border-gray-200 bg-gray-50 p-4 md:w-72 md:p-6 md:border-b-0 md:border-r"
    >
      <section>
        <h2 className={headingClass}>Categories</h2>
        {categoriesError ? (
          <p className="mt-3 text-sm text-red-600">Couldn't load categories.</p>
        ) : categories ? (
          <CheckboxList
            options={categories.map((category) => ({
              value: category.slug,
              label: category.name,
            }))}
            selected={filters.categories}
            onToggle={handleCategoryToggle}
          />
        ) : (
          <p className={statusClass}>Loading categories...</p>
        )}
      </section>

      <hr className="my-5 border-gray-200" />

      <section>
        <h2 className={headingClass}>Price Range</h2>
        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={handlePriceChange}
        />
      </section>

      <hr className="my-5 border-gray-200" />

      <section>
        <h2 className={headingClass}>Brands</h2>
        {isLoadingBrands ? (
          <p className={statusClass}>Loading brands...</p>
        ) : brands.length ? (
          <CheckboxList
            options={brands.map((brand) => ({ value: brand, label: brand }))}
            selected={filters.brands}
            onToggle={handleBrandToggle}
          />
        ) : (
          <p className={statusClass}>No brands to filter by.</p>
        )}
      </section>
    </aside>
  );
}

export default FilterSection;

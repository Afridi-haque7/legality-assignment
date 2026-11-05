# Product Catalog

Product listing and detail pages built with React, React Router and Tailwind CSS using the [DummyJSON Products API](https://dummyjson.com/docs/products).

## Setup instructions

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173. No environment variables are needed.

Other scripts: `npm run build`, `npm run preview`, `npm run lint`.

## Assumptions made

- Category and brand filters support multiple selection.
- Brand options come from the products in the selected categories, so changing the category resets the selected brands.
- Products without a brand are hidden once a brand filter is applied.
- Min and max price are inclusive. The price filter applies after a 400ms debounce instead of on every keystroke.
- Search wasn't part of the requirements, but the navbar already had a search box, so I wired it up to filter by product title.
- The cart, dashboard and profile icons in the navbar are placeholders.
- Product data doesn't change during a session, so API responses are cached in memory.

## Folder structure

```
src/
├── api.js                      # API calls, response cache and error handling
├── App.jsx                     # Routes
├── main.jsx                    # Entry point, router setup
├── index.css                   # Tailwind import
├── pages/
│   ├── ProductListing.jsx      # Product fetching, filtering and pagination
│   └── ProductDetails.jsx      # Single product page
└── components/
    ├── Layout.jsx              # Shared layout with navbar and <Outlet />
    ├── Navbar.jsx              # Search and filter toggle
    ├── FilterSection.jsx       # Category, price and brand filters
    ├── ProductListingCard.jsx  # Product card in the grid
    ├── ProductHeroCard.jsx     # Product details view
    ├── Pagination.jsx
    ├── StarRating.jsx
    ├── Button.jsx
    └── BackButton.jsx
```

## Architectural decisions

- Filters and the current page are stored in URL query params. Refreshing the page or going back from the detail page keeps the same filters, without needing a global state library.
- The Back button on the detail page uses `navigate(-1)` to return to the listing, and falls back to `/` when the product page is opened directly.
- DummyJSON can only filter by category, so I fetch all products for the selected categories (`limit=0`, with `select` for only the fields the cards need) and handle price, brand, search and pagination on the client. The catalog is under 200 products, so this is fast enough.
- All API calls live in `src/api.js`, with a small in-memory cache and an error that includes the status code. The detail page uses it to show "not found" for invalid IDs.
- Fetch effects ignore stale responses, so switching categories quickly never shows outdated results.
- `Layout` is a shared route that renders the navbar and each page through `<Outlet />`.
- Styling uses Tailwind only, with no UI library.

## Improvements if given more time

- Unit tests for the filtering and pagination logic, and component tests with Vitest and React Testing Library.
- Make the application responsive for different screen sizes, especially the product grid and filter section.
- Use server-side pagination when only the category filter is applied.
- Sorting by price and rating.
- Keep the selected brands that still exist after a category change instead of clearing all of them.
- A filter drawer on mobile and a skeleton loader on the detail page.
- Migrate to TypeScript.

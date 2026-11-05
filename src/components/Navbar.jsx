import { ChartPie, Menu, Search, ShoppingCart, User } from "lucide-react";

function Navbar({ isMenuOpen, onMenuClick, searchQuery, onSearch }) {
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(new FormData(event.currentTarget).get("q").trim());
  };

  return (
    <nav className="flex items-center justify-between gap-3 bg-slate-700 px-4 py-3 text-white md:gap-4 md:px-6">
      <button
        type="button"
        aria-label="Toggle filters"
        aria-expanded={isMenuOpen}
        aria-controls="filter-menu"
        onClick={onMenuClick}
        className="cursor-pointer"
      >
        <Menu />
      </button>

      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="relative w-full min-w-0 max-w-xl"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
        <input
          key={searchQuery}
          type="search"
          name="q"
          defaultValue={searchQuery}
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full rounded-md bg-white py-2 pl-10 pr-3 text-gray-800 outline-none placeholder:text-gray-500"
        />
      </form>

      <div className="flex items-center gap-3 md:gap-5">
        <button aria-label="Cart" className="cursor-pointer">
          <ShoppingCart />
        </button>
        <button aria-label="Dashboard" className="cursor-pointer">
          <ChartPie />
        </button>
        <button aria-label="Profile" className="cursor-pointer">
          <User />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

import { useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  // Kept here so the navbar can toggle the filters, and they stay as set across pages
  const [isFilterOpen, setIsFilterOpen] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = (query) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (query) params.set("q", query);
    else params.delete("q");
    navigate({ pathname: "/", search: params.toString() });
  };

  return (
    <>
      <Navbar
        isMenuOpen={isFilterOpen}
        onMenuClick={() => setIsFilterOpen((isOpen) => !isOpen)}
        searchQuery={searchParams.get("q") ?? ""}
        onSearch={handleSearch}
      />
      <main className="flex justify-center">
        <Outlet context={{ isFilterOpen }} />
      </main>
    </>
  );
}

export default Layout;

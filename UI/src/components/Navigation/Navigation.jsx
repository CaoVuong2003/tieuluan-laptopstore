import React, { useState, useEffect, useRef } from "react";
import { Wishlist } from "../common/Wishlist";
import { AccountIcon } from "../common/AccountIcon";
import { CartIcon } from "../common/CartIcon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTotalQuantity } from "../../store/features/cart"; 
import { getProductBySearch } from "../../api/fetch/fetchProducts";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../Buttons/LanguageSwitcher";
import "./Navigation.css";

const Navigation = ({ variant = "default" }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const totalQuantity = useSelector(selectTotalQuantity);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchBoxRef = useRef(null);

  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleProductClick = (slug) => {
    setSearchTerm("");
    setFilteredProducts([]);
    navigate(`/product/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setFilteredProducts([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        getProductBySearch(searchTerm)
          .then((data) => setFilteredProducts(data))
          .catch(() => setFilteredProducts([]));
      } else {
        setFilteredProducts([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <nav className="bg-white shadow-md w-full z-40">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4 gap-8">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-black">
            LaptopStore
          </Link>

          {/* Desktop Menu */}
          {variant === "default" && (
            <ul className="hidden md:flex gap-8 text-gray-600 font-medium mx-auto">
              <li><NavLink to="/" className={({ isActive }) => isActive ? "text-black" : ""}>{t("nav.home")}</NavLink></li>
              <li><NavLink to="/laptop" className={({ isActive }) => isActive ? "text-black" : ""}>{t("nav.laptop")}</NavLink></li>
              <li><NavLink to="/linhkien" className={({ isActive }) => isActive ? "text-black" : ""}>{t("nav.laptopComponents")}</NavLink></li>
              <li><NavLink to="/phukien" className={({ isActive }) => isActive ? "text-black" : ""}>{t("nav.accessory")}</NavLink></li>
            </ul>
          )}

          {/* Icons + Search */}
          <div className="flex items-center gap-4">
            {/* Search desktop */}
            {variant === "default" && (
              <div
                className="hidden md:block relative w-64"
                ref={searchBoxRef}
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={t("nav.search_placeholder")}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                />
                {searchTerm && filteredProducts.length > 0 && (
                  <ul className="absolute top-full left-0 bg-white shadow-lg mt-1 rounded w-full max-h-80 overflow-y-auto z-50 border">
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductClick(product.slug)}
                      >
                        <img
                          src={product.thumbnail || "/default-image.jpg"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {product.price.toLocaleString()}₫
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Desktop Icons */}
            {variant === "default" && (
              <div className="hidden sm:flex items-center gap-4">
                <button onClick={() => navigate("/account-details/profile")}>
                  <AccountIcon />
                </button>
                <button>
                  <Wishlist />
                </button>
                <Link to="/cart-items" className="relative">
                  <CartIcon />
                  {totalQuantity > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              </div>
            )}

            {/* Auth variant */}
            {variant === "auth" && (
              <>
                <NavLink to="/auth/login" className="px-3 py-1 border rounded">{t("auth.login")}</NavLink>
                <NavLink to="/auth/register" className="px-3 py-1 border rounded">{t("auth.register")}</NavLink>
              </>
            )}

            {/* Language switch desktop */}
            <div className="hidden md:block ml-4">
              <LanguageSwitcher />
            </div>

            {/* Mobile toggles */}
            <div className="flex md:hidden gap-3 items-center">
              <Link to="/cart-items" className="relative">
                <CartIcon />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Link>
              <button onClick={() => setShowSearchInput(!showSearchInput)}>
                🔍
              </button>
              {variant === "default" && (
                <button onClick={() => setShowMobileMenu(!showMobileMenu)}>
                  {showMobileMenu ? "✖" : "☰"}
                </button>
              )}
              {showMobileMenu && variant === "auth" && (
                <div className="mt-3">
                  <LanguageSwitcher />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearchInput && (
        <div className="md:hidden px-4 pb-2" ref={searchBoxRef}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("nav.search_placeholder")}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          />
          {searchTerm && filteredProducts.length > 0 && (
            <ul className="bg-white shadow-lg mt-1 rounded w-full max-h-60 overflow-y-auto z-50 border">
              {filteredProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleProductClick(product.slug)}
                >
                  <img
                    src={product.thumbnail || "/default-image.jpg"}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.price.toLocaleString()}₫</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {showMobileMenu && variant === "default" && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <ul className="flex flex-col gap-3 px-4 py-4">
            <NavLink to="/" onClick={() => setShowMobileMenu(false)}>{t("nav.home")}</NavLink>
            <NavLink to="/laptop" onClick={() => setShowMobileMenu(false)}>{t("nav.laptop")}</NavLink>
            <NavLink to="/linhkien" onClick={() => setShowMobileMenu(false)}>{t("nav.laptopComponents")}</NavLink>
            <NavLink to="/phukien" onClick={() => setShowMobileMenu(false)}>{t("nav.accessory")}</NavLink>

            {/* Account + Wishlist */}
            <div className="flex gap-3 mt-3">
              <button onClick={() => navigate("/account-details/profile")}><AccountIcon /></button>
              <button><Wishlist /></button>
            </div>

            {/* Language switch mobile */}
            <div className="mt-3">
              <LanguageSwitcher mobile />
            </div>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

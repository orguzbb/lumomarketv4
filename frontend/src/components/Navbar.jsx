import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import CatalogModal from "./CatalogModal";
import {
  TbMapPin,
  TbChevronDown,
  TbSearch,
  TbHeart,
  TbShoppingBag,
  TbUser,
  TbGridDots,
  TbTruck,
  TbHelpCircle,
  TbShirt,
  TbSparkles,
  TbDeviceMobile,
  TbHome,
  TbClock,
  TbDeviceTv,
  TbBallFootball,
  TbCar,
  TbLogout,
  TbUserCheck
} from "react-icons/tb";

const CATEGORY_NAV_ITEMS = [
  { id: "clothing", label: "Kiyim va poyabzal", icon: TbShirt },
  { id: "beauty", label: "Go'zallik va parvarish", icon: TbSparkles },
  { id: "electronics", label: "Elektronika", icon: TbDeviceMobile },
  { id: "appliances", label: "Maishiy texnika", icon: TbDeviceTv },
  { id: "home", label: "Uy-ro'zg'or buyumlari", icon: TbHome },
  { id: "accessories", label: "Aksessuarlar", icon: TbClock },
  { id: "sports", label: "Sport va hordiq", icon: TbBallFootball },
  { id: "auto", label: "Avtotovarlar", icon: TbCar },
  { id: "health", label: "Salomatlik", icon: TbHeart }
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { selectedLocation, openModal: openRegionModal } = useLocation();
  const { totalCount, openDrawer } = useCart();
  const { i18n } = useTranslation();

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <>
      <header className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm">
        {/* Top Notice / Location Bar */}
        <div className="bg-gray-50 text-gray-600 text-xs py-2 px-4 border-b border-gray-100">
          <div className="container mx-auto flex items-center justify-between">
            {/* Left: Region Picker & Pickup points */}
            <div className="flex items-center gap-6">
              <button
                onClick={openRegionModal}
                className="flex items-center gap-1.5 font-medium hover:text-brand transition-colors group"
              >
                <TbMapPin className="w-3.5 h-3.5 text-brand" />
                <span>Shahar:</span>
                <span className="font-bold text-gray-900 group-hover:text-brand">
                  {selectedLocation.shortName}
                </span>
                <TbChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-brand transition-transform group-hover:translate-y-0.5" />
              </button>

              <div className="hidden sm:flex items-center gap-1 text-gray-500">
                <TbTruck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Buyurtmangizni 1 kunda bepul yetkazib beramiz!</span>
              </div>
            </div>

            {/* Right: Help & Language */}
            <div className="flex items-center gap-5">
              <a
                href="#faq"
                className="hidden md:flex items-center gap-1 hover:text-brand transition-colors"
              >
                <TbHelpCircle className="w-3.5 h-3.5" />
                <span>Savol-javoblar</span>
              </a>

              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md px-1.5 py-0.5">
                <select
                  onChange={(e) => changeLang(e.target.value)}
                  value={i18n.language}
                  className="bg-transparent font-semibold text-gray-800 outline-none cursor-pointer text-xs"
                >
                  <option value="uz">O'zbekcha</option>
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="container mx-auto py-3.5 px-4 flex items-center justify-between gap-4 sm:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand text-white font-black text-xl flex items-center justify-center shadow-md shadow-brand/30">
              L
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900">
              lumo<span className="text-brand">market</span>
            </span>
          </Link>

          {/* Catalog Button */}
          <button
            onClick={() => setIsCatalogOpen(true)}
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-brand font-bold px-4 py-2.5 rounded-xl border border-purple-200/60 transition-all flex-shrink-0 active:scale-95"
          >
            <TbGridDots className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Katalog</span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <div className="flex items-center border-2 border-brand rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand/20 transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulotlar va turkumlar bo'yicha qidiruv..."
                className="w-full px-4 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                className="bg-brand hover:bg-brand-dark text-white px-5 py-2.5 flex items-center justify-center transition-colors"
              >
                <TbSearch className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Actions: Wishlist, Cart, Profile */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2.5 sm:px-3 text-gray-700 hover:text-brand hover:bg-purple-50 rounded-xl flex items-center gap-1.5 transition-all relative group"
              title="Saralanganlar"
            >
              <TbHeart className="w-6 h-6 stroke-[1.8] group-hover:scale-110 transition-transform" />
              <span className="hidden lg:inline text-xs font-semibold">Saralanganlar</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={openDrawer}
              className="p-2.5 sm:px-3 text-gray-700 hover:text-brand hover:bg-purple-50 rounded-xl flex items-center gap-1.5 transition-all relative group"
              title="Savat"
            >
              <div className="relative">
                <TbShoppingBag className="w-6 h-6 stroke-[1.8] group-hover:scale-110 transition-transform" />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-up">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-xs font-semibold">Savat</span>
            </button>

            {/* Auth / Account */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 sm:px-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-xs font-bold text-gray-800">
                  <TbUserCheck className="w-5 h-5 text-brand" />
                  <span className="hidden md:inline max-w-[100px] truncate">{user.fullname}</span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 top-full pt-2 hidden group-hover:block w-48 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-purple-50 hover:text-brand rounded-xl"
                    >
                      <TbUser className="w-4 h-4" /> Profilim
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-xl"
                      >
                        Admin Paneli
                      </Link>
                    )}
                    {user.role === "seller" && (
                      <Link
                        to="/seller"
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-xl"
                      >
                        Sotuvchi Paneli
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      <TbLogout className="w-4 h-4" /> Chiqish
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-brand/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <TbUser className="w-4 h-4" />
                <span>Kirish</span>
              </Link>
            )}
          </div>
        </div>

        {/* Subheader Category Pill Nav (SVG Icons ONLY!) */}
        <div className="border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-6 py-2.5 text-xs font-semibold text-gray-600 whitespace-nowrap">
              {CATEGORY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={`/category/${item.id}`}
                    className="flex items-center gap-1.5 hover:text-brand transition-colors group py-1"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-brand transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Catalog Mega-Menu Modal */}
      <CatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} />
    </>
  );
};

export default Navbar;

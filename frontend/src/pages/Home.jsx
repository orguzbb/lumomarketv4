import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BannerSlider from "../components/BannerSlider";
import ProductQuickViewModal from "../components/ProductQuickViewModal";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../api/axios";
import {
  TbShirt,
  TbSparkles,
  TbDeviceMobile,
  TbHome,
  TbClock,
  TbDeviceTv,
  TbBallFootball,
  TbCar,
  TbHeart,
  TbShoppingBag,
  TbStar,
  TbChevronRight,
  TbFlame,
  TbDiscount
} from "react-icons/tb";

// Featured categories with crisp SVG icons
const HOME_CATEGORIES = [
  { id: "clothing", key: "clothing", icon: TbShirt, color: "bg-pink-50 text-pink-600 border-pink-100" },
  { id: "beauty", key: "beauty", icon: TbSparkles, color: "bg-purple-50 text-purple-600 border-purple-100" },
  { id: "electronics", key: "electronics", icon: TbDeviceMobile, color: "bg-blue-50 text-blue-600 border-blue-100" },
  { id: "appliances", key: "appliances", icon: TbDeviceTv, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { id: "home", key: "homeItems", icon: TbHome, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id: "accessories", key: "accessories", icon: TbClock, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { id: "sports", key: "sports", icon: TbBallFootball, color: "bg-teal-50 text-teal-600 border-teal-100" },
  { id: "auto", key: "auto", icon: TbCar, color: "bg-rose-50 text-rose-600 border-rose-100" }
];

// Fallback demo products if DB is empty so page looks amazing immediately
const DEMO_PRODUCTS = [
  {
    _id: "demo-1",
    name: "Apple AirPods Pro 2 Simsiz quloqchinlar MagSafe kassa bilan",
    price: 2850000,
    oldPrice: 3400000,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 342,
    category: "electronics"
  },
  {
    _id: "demo-2",
    name: "Erkaklar uchun zamonaviy sport krossovkasi Uzum Edition",
    price: 249000,
    oldPrice: 320000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 198,
    category: "clothing"
  },
  {
    _id: "demo-3",
    name: "Simsiz quloqchinlar TWS Bluetooth 5.3 Shovqin so'ndirish bilan",
    price: 199000,
    oldPrice: 290000,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 512,
    category: "electronics"
  },
  {
    _id: "demo-4",
    name: "Aqlli soat Smart Watch Ultra Series 9 (Suvdan himoyalangan)",
    price: 349000,
    oldPrice: 480000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewsCount: 145,
    category: "accessories"
  },
  {
    _id: "demo-5",
    name: "Oshxona kombayni Ko'p funksiyali blender set 800W",
    price: 420000,
    oldPrice: 550000,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    reviewsCount: 89,
    category: "appliances"
  },
  {
    _id: "demo-6",
    name: "Ayollar kremi Nemlantiruvchi va parvarishlovchi Hyaluronic Acid",
    price: 95000,
    oldPrice: 130000,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 276,
    category: "beauty"
  },
  {
    _id: "demo-7",
    name: "Simsiz elektr choynak Zanglamaydigan po'lat 1.8 Litr",
    price: 155000,
    oldPrice: 210000,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    reviewsCount: 110,
    category: "appliances"
  },
  {
    _id: "demo-8",
    name: "Erkaklar kostyum shimi Klassik dizayn Premium Paxta",
    price: 380000,
    oldPrice: 520000,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 64,
    category: "clothing"
  }
];

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [selectedQuickView, setSelectedQuickView] = useState(null);

  // Check URL hash for category navigation (e.g. #clothing, #beauty, #electronics)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && hash !== "faq" && hash !== "all") {
        const matchingCat = HOME_CATEGORIES.find((c) => c.id === hash);
        if (matchingCat) {
          navigate(`/category/${matchingCat.id}`);
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        if (data && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (err) {
        console.warn("Using fallback demo products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-10 pb-10">
      {/* 1. Hero Banner Slider */}
      <section className="pt-2">
        <BannerSlider />
      </section>

      {/* 2. Popular Categories Grid (SVG Icons ONLY) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>{t("popularCategories")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {HOME_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cat.color}`}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold leading-tight">{t(cat.key)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Flash Sale / Super Arzon Narxlar Section */}
      <section className="bg-gradient-to-r from-purple-900 via-brand to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-purple-950 flex items-center justify-center font-black animate-pulse">
              <TbFlame className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{t("superDeals")}</h2>
              <p className="text-xs text-purple-200">{t("superDealsSubtitle")}</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
            <TbDiscount className="w-4 h-4 text-yellow-300" />
            <span>{t("discountsUpTo")}</span>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => {
            const price = p.price || 150000;
            const oldPrice = p.oldPrice || Math.round(price * 1.3);
            const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
            const monthlyPayment = Math.round(price / 12);
            const img = p.images?.[0]?.url || p.image || DEMO_PRODUCTS[0].image;

            return (
              <div
                key={p._id}
                className="bg-white text-gray-900 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative mb-3 cursor-pointer" onClick={() => setSelectedQuickView(p)}>
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-yellow-400 text-purple-950 font-black text-[11px] px-2 py-0.5 rounded-lg shadow">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <h3
                    onClick={() => setSelectedQuickView(p)}
                    className="text-xs font-bold text-gray-800 line-clamp-2 hover:text-brand cursor-pointer"
                  >
                    {p.name}
                  </h3>

                  {/* Installment Badge */}
                  <div className="bg-purple-50 text-brand text-[10px] font-extrabold px-2 py-1 rounded-md inline-block">
                    {monthlyPayment.toLocaleString()} {t("perMonth")}
                  </div>

                  <div className="pt-1 flex items-baseline justify-between">
                    <div>
                      <div className="text-base font-extrabold text-brand">
                        {price.toLocaleString()} <span className="text-[10px]">so'm</span>
                      </div>
                      {oldPrice > price && (
                        <div className="text-[11px] text-gray-400 line-through">
                          {oldPrice.toLocaleString()} so'm
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      className="w-9 h-9 rounded-xl bg-brand hover:bg-brand-dark text-white flex items-center justify-center shadow-md shadow-brand/20 transition-all active:scale-90"
                      title={t("addToCart")}
                    >
                      <TbShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Main Products List (Uzum Market Card Style) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            {t("youMightLike")}
          </h2>
          <Link to="/category/all" className="text-xs font-bold text-brand hover:underline flex items-center gap-1">
            <span>{t("seeAll")}</span>
            <TbChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => {
            const price = p.price || 150000;
            const oldPrice = p.oldPrice || Math.round(price * 1.25);
            const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
            const monthlyPayment = Math.round(price / 12);
            const rating = p.rating || 4.9;
            const reviewsCount = p.reviewsCount || 84;
            const img = p.images?.[0]?.url || p.image || DEMO_PRODUCTS[0].image;

            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative mb-3 cursor-pointer" onClick={() => setSelectedQuickView(p)}>
                  <div className="w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow">
                      -{discountPercent}%
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p);
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
                      isInWishlist(p._id || p.id)
                        ? "text-red-500 bg-red-50"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                    title={t("favorites")}
                  >
                    <TbHeart className={`w-4 h-4 ${isInWishlist(p._id || p.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                      <TbStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-gray-800">{rating}</span>
                      <span>({reviewsCount} {t("reviewsCount")})</span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => setSelectedQuickView(p)}
                      className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-brand cursor-pointer mb-2"
                    >
                      {p.name}
                    </h3>
                  </div>

                  {/* Bottom section */}
                  <div className="space-y-2">
                    {/* Installment Badge */}
                    <div className="bg-yellow-100/70 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                      {monthlyPayment.toLocaleString()} {t("perMonth")}
                    </div>

                    <div className="pt-1 flex items-end justify-between">
                      <div>
                        {oldPrice > price && (
                          <div className="text-[11px] text-gray-400 line-through font-medium">
                            {oldPrice.toLocaleString()} so'm
                          </div>
                        )}
                        <div className="text-sm sm:text-base font-black text-gray-900">
                          {price.toLocaleString()} <span className="text-[10px] font-normal">so'm</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-9 h-9 rounded-xl border border-brand text-brand hover:bg-brand hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-sm"
                        title={t("addToCart")}
                      >
                        <TbShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedQuickView && (
        <ProductQuickViewModal
          product={selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
        />
      )}
    </div>
  );
};

export default Home;

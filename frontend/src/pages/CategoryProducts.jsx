import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductQuickViewModal from "../components/ProductQuickViewModal";
import {
  TbChevronRight,
  TbHome,
  TbShoppingBag,
  TbStar,
  TbHeart,
  TbPackageOff,
  TbArrowLeft
} from "react-icons/tb";

const CATEGORY_TRANSLATION_KEYS = {
  clothing: "clothing",
  beauty: "beauty",
  electronics: "electronics",
  appliances: "appliances",
  home: "homeItems",
  accessories: "accessories",
  sports: "sports",
  auto: "auto",
  kids: "kids",
  books: "books"
};

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

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuickView, setSelectedQuickView] = useState(null);

  const translationKey = CATEGORY_TRANSLATION_KEYS[categoryId];
  const categoryTitle = translationKey ? t(translationKey) : categoryId || t("catalog");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products?category=${categoryId}`);
        if (data && data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          // Fallback to matching demo products
          const matched = DEMO_PRODUCTS.filter(
            (p) => p.category === categoryId || categoryId === "all"
          );
          setProducts(matched);
        }
      } catch (err) {
        const matched = DEMO_PRODUCTS.filter(
          (p) => p.category === categoryId || categoryId === "all"
        );
        setProducts(matched);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryId]);

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 py-2">
        <Link to="/" className="hover:text-brand flex items-center gap-1">
          <TbHome className="w-4 h-4 text-brand" />
          <span>{t("home")}</span>
        </Link>
        <TbChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">{t("catalog")}</span>
        <TbChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-bold text-gray-800">{categoryTitle}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{categoryTitle}</h1>
          <p className="text-xs text-gray-500 mt-1">
            {t("foundProducts")}: <span className="font-bold text-brand">{products.length} ta</span>
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand hover:text-brand-dark bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-all"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>{t("backToHome")}</span>
        </Link>
      </div>

      {/* Products Grid or Empty State */}
      {loading ? (
        <div className="py-16 text-center text-gray-400 text-sm">
          Mahsulotlar yuklanmoqda...
        </div>
      ) : products.length > 0 ? (
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
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                      <TbStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-gray-800">{rating}</span>
                      <span>({reviewsCount} {t("reviewsCount")})</span>
                    </div>
                    <h3
                      onClick={() => setSelectedQuickView(p)}
                      className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-brand cursor-pointer mb-2"
                    >
                      {p.name}
                    </h3>
                  </div>

                  <div className="space-y-2">
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
      ) : (
        <div className="py-20 bg-white rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center p-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-purple-50 text-brand flex items-center justify-center mb-4">
            <TbPackageOff className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {t("noProductsCategory")}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mb-6">
            {t("noProductsSubtitle")}
          </p>
          <Link
            to="/"
            className="bg-brand hover:bg-brand-dark text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-brand/20 transition-all flex items-center gap-2"
          >
            <TbArrowLeft className="w-4 h-4" />
            <span>{t("backToHome")}</span>
          </Link>
        </div>
      )}

      {selectedQuickView && (
        <ProductQuickViewModal
          product={selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
        />
      )}
    </div>
  );
};

export default CategoryProducts;

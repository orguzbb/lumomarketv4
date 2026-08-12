import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ProductQuickViewModal from "../components/ProductQuickViewModal";
import {
  TbHeart,
  TbShoppingBag,
  TbStar,
  TbTrash,
  TbArrowLeft,
  TbHeartOff
} from "react-icons/tb";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedQuickView, setSelectedQuickView] = useState(null);

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6 animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-red-50 text-red-400 flex items-center justify-center mx-auto shadow-inner">
          <TbHeartOff className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Saralanganlar bo'sh</h2>
          <p className="text-xs text-gray-500 mt-2">
            Sizga ma'qul kelgan mahsulotlardagi yurakcha tugmasini bosib, saralanganlar ro'yxatiga saqlashingiz mumkin.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand/20 transition-all text-xs"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Saralangan mahsulotlar</h1>
            <span className="bg-red-50 text-red-500 font-bold text-xs px-3 py-1 rounded-full border border-red-100">
              {wishlist.length} ta
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Sizga yoqqan va saqlab qo'ygan mahsulotlaringiz</p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-xl transition-all"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Xaridlarni davom ettirish</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlist.map((p) => {
          const productId = p._id || p.id;
          const img = p.images?.[0]?.url || p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80";
          const price = p.price || 0;
          const oldPrice = p.oldPrice || (price ? Math.round(price * 1.25) : 0);
          const discountPercent = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
          const monthlyPayment = Math.round(price / 12);
          const rating = p.rating || 4.9;
          const reviewsCount = p.reviewsCount || 42;

          return (
            <div
              key={productId}
              className="bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 group relative"
            >
              {/* Top Image Box */}
              <div className="relative mb-3 cursor-pointer" onClick={() => setSelectedQuickView(p)}>
                <div className="w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center">
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
                {/* Heart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(productId);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 hover:scale-110 transition-transform shadow-md"
                  title="Saralanganlardan olib tashlash"
                >
                  <TbHeart className="w-4 h-4 fill-red-500" />
                </button>
              </div>

              {/* Info & Content */}
              <div className="space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                    <TbStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-gray-800">{rating}</span>
                    <span>({reviewsCount})</span>
                  </div>

                  <h3
                    onClick={() => setSelectedQuickView(p)}
                    className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-brand cursor-pointer mb-2"
                  >
                    {p.name}
                  </h3>
                </div>

                <div className="space-y-2">
                  <span className="inline-block bg-purple-50 text-brand text-[10px] font-bold px-2 py-0.5 rounded-md border border-purple-100">
                    {monthlyPayment.toLocaleString()} so'm/oy
                  </span>

                  <div className="pt-1 flex items-baseline justify-between">
                    <div>
                      {oldPrice > price && (
                        <span className="text-[10px] text-gray-400 line-through block">
                          {oldPrice.toLocaleString()} so'm
                        </span>
                      )}
                      <span className="text-sm font-black text-gray-900">
                        {price.toLocaleString()} <span className="text-[10px] font-normal">so'm</span>
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      className="p-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
                      title="Savatga qo'shish"
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

      {selectedQuickView && (
        <ProductQuickViewModal
          product={selectedQuickView}
          onClose={() => setSelectedQuickView(null)}
        />
      )}
    </div>
  );
};

export default Wishlist;

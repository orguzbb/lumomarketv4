import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { TbX, TbStar, TbShoppingBag, TbHeart, TbCheck, TbTruck, TbShieldCheck } from "react-icons/tb";

const ProductQuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const image = product.images?.[0]?.url || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";
  const name = product.name || "Mahsulot";
  const price = product.price || 120000;
  const oldPrice = product.oldPrice || Math.round(price * 1.25);
  const discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
  const monthlyPayment = Math.round(price / 12);
  const rating = product.rating || 4.9;
  const reviewsCount = product.reviewsCount || 128;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col md:flex-row border border-gray-100 max-h-[90vh] overflow-y-auto animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <TbX className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-50 p-6 flex items-center justify-center relative min-h-[300px]">
          <img
            src={image}
            alt={name}
            className="w-full h-72 object-contain rounded-2xl drop-shadow-md"
          />
          {discountPercent > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-400 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                <TbStar className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                <span>{rating}</span>
              </div>
              <span className="text-gray-400">({reviewsCount} sharhlar)</span>
              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                <TbCheck className="w-3 h-3" /> Omborda bor
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 leading-snug">{name}</h2>

            {/* Installment Badge */}
            <div className="inline-flex items-center gap-2 bg-purple-50 text-brand text-xs font-semibold px-3 py-1.5 rounded-xl border border-purple-100">
              <span>Muddatli to'lov:</span>
              <span className="font-bold bg-brand text-white px-2 py-0.5 rounded-md">
                {monthlyPayment.toLocaleString()} so'm/oy
              </span>
            </div>

            {/* Price */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="text-2xl font-black text-brand">
                {price.toLocaleString()} <span className="text-sm font-semibold">so'm</span>
              </span>
              {oldPrice > price && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  {oldPrice.toLocaleString()} so'm
                </span>
              )}
            </div>

            {/* Benefits */}
            <div className="pt-2 space-y-2 text-xs text-gray-600 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <TbTruck className="w-4 h-4 text-brand" />
                <span>1 kunda bepul yetkazib berish</span>
              </div>
              <div className="flex items-center gap-2">
                <TbShieldCheck className="w-4 h-4 text-brand" />
                <span>10 kun kafolatlangan qaytarish</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${
                  isInWishlist(product._id || product.id)
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500"
                }`}
                title="Saralanganlarga saqlash"
              >
                <TbHeart className={`w-5 h-5 ${isInWishlist(product._id || product.id) ? "fill-red-500 text-red-500" : ""}`} />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand/25 transition-all active:scale-[0.99]"
            >
              <TbShoppingBag className="w-5 h-5" />
              <span>Savatga qo'shish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickViewModal;

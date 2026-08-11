import React from "react";
import { useCart } from "../context/CartContext";
import { TbX, TbTrash, TbPlus, TbMinus, TbShoppingBag, TbArrowRight, TbTruck } from "react-icons/tb";
import { Link } from "react-router-dom";

const CartDrawer = () => {
  const { cart, totalCount, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isDrawerOpen) return null;

  const subtotal = cart.subtotal || 0;
  const freeDeliveryThreshold = 100000;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-slide-left">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                <TbShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Savat</h2>
                <p className="text-xs text-gray-500">{totalCount} ta mahsulot</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.items?.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Tozalash
                </button>
              )}
              <button
                onClick={closeDrawer}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Delivery Bar */}
          <div className="bg-purple-50/70 p-3 px-5 border-b border-purple-100/50">
            <div className="flex items-center gap-2 text-xs font-medium text-purple-900 mb-1.5">
              <TbTruck className="w-4 h-4 text-brand" />
              {remainingForFreeDelivery === 0 ? (
                <span className="text-emerald-600 font-semibold">Tabriklaymiz! Bepul yetkazib berish mavjud! 🎉</span>
              ) : (
                <span>
                  Yana <span className="font-bold text-brand">{remainingForFreeDelivery.toLocaleString()} so'm</span> lik harid qiling va bepul yetkazib berishga ega bo'ling!
                </span>
              )}
            </div>
            <div className="w-full bg-purple-200/60 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand h-full transition-all duration-500 ease-out"
                style={{ width: `${freeDeliveryProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {cart.items && cart.items.length > 0 ? (
              cart.items.map((item) => {
                const product = item.product || {};
                const productId = product._id || item.product || item.id;
                const name = item.name || product.name || "Mahsulot";
                const price = item.price || product.price || 0;
                const image = item.image || product.images?.[0]?.url || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80";

                return (
                  <div key={productId} className="py-4 flex gap-4 items-center first:pt-0">
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 bg-gray-50 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{name}</h4>
                      <div className="text-sm font-bold text-brand mb-2">
                        {price.toLocaleString()} <span className="text-xs font-normal">so'm</span>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <TbMinus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <TbPlus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(productId)}
                          className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                          title="Olib tashlash"
                        >
                          <TbTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-purple-50 text-brand/40 flex items-center justify-center mb-4">
                  <TbShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">Savat hali bo'sh</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Savatga mahsulot qo'shish uchun asosiy sahifadagi mahsulotlarni ko'rib chiqing
                </p>
                <button
                  onClick={closeDrawer}
                  className="bg-brand text-white text-xs font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-dark transition-colors shadow-md shadow-brand/20"
                >
                  Xarid qilishni boshlash
                </button>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.items && cart.items.length > 0 && (
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Mahsulotlar ({totalCount}):</span>
                  <span>{subtotal.toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Yetkazib berish:</span>
                  <span className="text-emerald-600 font-medium">
                    {remainingForFreeDelivery === 0 ? "Bepul" : "15 000 so'm"}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200/60 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Jami:</span>
                  <span className="text-xl font-black text-brand">
                    {subtotal.toLocaleString()} <span className="text-sm font-semibold">so'm</span>
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="w-full bg-brand text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors shadow-lg shadow-brand/25 active:scale-[0.99]"
              >
                <span>Rasmiylashtirishga o'tish</span>
                <TbArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;

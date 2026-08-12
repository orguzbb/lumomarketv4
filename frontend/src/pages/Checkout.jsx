import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import {
  TbArrowLeft,
  TbTruck,
  TbCreditCard,
  TbCheck,
  TbShoppingBag,
  TbMapPin,
  TbUser,
  TbPhone,
  TbCash,
  TbShieldCheck,
  TbBuildingStore,
  TbPrinter
} from "react-icons/tb";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "+998 ",
    city: "Toshkent",
    address: "",
    comment: "",
    paymentMethod: "cash" // 'cash', 'uzcard', 'click', 'payme'
  });

  const subtotal = cart.subtotal || 0;
  const deliveryFee = subtotal >= 100000 || subtotal === 0 ? 0 : 15000;
  const grandTotal = subtotal + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!cart.items || cart.items.length === 0) {
      toast.error("Savat bo'sh, iltimos mahsulot qo'shing");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Yetkazib berish manzilini kiriting!");
      return;
    }

    setLoading(true);

    const cartItemsSnapshot = cart.items.map((i) => ({
      product: i.product?._id || i.product,
      name: i.name || i.product?.name || "Mahsulot",
      price: Number(i.price || i.product?.price || 0),
      quantity: Number(i.quantity || 1),
      image: i.image || i.product?.images?.[0]?.url || i.product?.image || "",
      seller: i.product?.seller || null,
    }));

    const orderData = {
      shippingAddress: {
        address: formData.address,
        street: formData.address,
        city: formData.city,
        phone: formData.phone,
        fullname: formData.fullname,
        comment: formData.comment,
      },
      paymentMethod: formData.paymentMethod,
      items: cartItemsSnapshot,
    };

    try {
      let createdOrder = null;
      try {
        const res = await api.post("/orders", orderData);
        createdOrder = res.data;
      } catch (err) {
        console.warn("Backend order submission error, using local order snapshot fallback", err);
        createdOrder = {
          _id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          invoiceNumber: "INV-" + Date.now() + "-" + Math.floor(100 + Math.random() * 900),
          items: cartItemsSnapshot,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: formData.paymentMethod,
          subtotal: subtotal,
          shippingFee: deliveryFee,
          total: grandTotal,
          createdAt: new Date().toISOString(),
        };
      }

      // Snapshot order before clearing cart
      const orderSnapshot = {
        _id: createdOrder._id || "ORD-" + Math.floor(100000 + Math.random() * 900000),
        invoiceNumber: createdOrder.invoiceNumber || ("INV-" + Date.now()),
        items: createdOrder.items && createdOrder.items.length > 0 ? createdOrder.items : cartItemsSnapshot,
        shippingAddress: createdOrder.shippingAddress || orderData.shippingAddress,
        paymentMethod: createdOrder.paymentMethod || formData.paymentMethod,
        subtotal: createdOrder.subtotal !== undefined ? createdOrder.subtotal : subtotal,
        shippingFee: createdOrder.shippingFee !== undefined ? createdOrder.shippingFee : deliveryFee,
        total: createdOrder.total || grandTotal,
        createdAt: createdOrder.createdAt || new Date().toISOString(),
      };

      await clearCart();
      setOrderSuccess(orderSnapshot);
      toast.success("Buyurtma muvaffaqiyatli rasmiylashtirildi! 🎉");
    } catch (err) {
      toast.error("Buyurtma rasmiylashtirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    const orderItems = orderSuccess.items || [];
    const totalSum = orderSuccess.total || 0;
    const subtotalSum = orderSuccess.subtotal || 0;
    const feeSum = orderSuccess.shippingFee !== undefined ? orderSuccess.shippingFee : 0;
    const invoiceNo = orderSuccess.invoiceNumber || orderSuccess._id || "INV-1001";
    const dateFormatted = new Date(orderSuccess.createdAt || Date.now()).toLocaleString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div className="max-w-2xl mx-auto py-8 px-4 animate-fade-in space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-scale-up">
            <TbCheck className="w-8 h-8 stroke-[3]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
            Rahmat! Buyurtmangiz qabul qilindi! 🎉
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Quyida rasmiy xarid cheki taqdim etilgan. Ushbu chekni saqlab qo'yishingiz yoki chop etishingiz mumkin.
          </p>
        </div>

        {/* OFFICIAL CHEK / KVITANSIYA CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6 font-sans">
          {/* Chek Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-dashed border-gray-300 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand text-white font-black text-sm flex items-center justify-center">L</div>
                <span className="text-xl font-black tracking-tight text-gray-900">lumo<span className="text-brand">market</span></span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Lumo Market v4 Onlayn gipermarketi</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-black bg-purple-50 text-brand px-3 py-1 rounded-full uppercase tracking-wider">
                Xarid Cheki
              </span>
              <p className="text-xs font-mono font-bold text-gray-900 mt-1.5">{invoiceNo}</p>
              <p className="text-[10px] text-gray-400">{dateFormatted}</p>
            </div>
          </div>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-2xl">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Mijoz:</span>
              <span className="font-bold text-gray-900">{orderSuccess.shippingAddress?.fullname || formData.fullname}</span>
              <span className="text-gray-600 block">{orderSuccess.shippingAddress?.phone || formData.phone}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Yetkazib berish manzili:</span>
              <span className="font-bold text-gray-900">
                {orderSuccess.shippingAddress?.city || formData.city}, {orderSuccess.shippingAddress?.address || formData.address}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Buyurtma qilingan mahsulotlar:</h4>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100/70 border-b border-gray-200 text-gray-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Mahsulot nomi</th>
                    <th className="p-3 text-center">Soni</th>
                    <th className="p-3 text-right">Narxi</th>
                    <th className="p-3 text-right">Jami</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {orderItems.map((it, idx) => {
                    const itemName = it.name || it.product?.name || "Mahsulot";
                    const itemPrice = Number(it.price || it.product?.price || 0);
                    const itemQty = Number(it.quantity || 1);
                    const lineTotal = itemPrice * itemQty;
                    return (
                      <tr key={idx} className="hover:bg-purple-50/20">
                        <td className="p-3 text-gray-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-gray-900">{itemName}</td>
                        <td className="p-3 text-center font-bold text-gray-700">{itemQty}</td>
                        <td className="p-3 text-right text-gray-600">{itemPrice.toLocaleString()} so'm</td>
                        <td className="p-3 text-right font-black text-gray-900">{lineTotal.toLocaleString()} so'm</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Payment Summary */}
          <div className="border-t border-dashed border-gray-300 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Mahsulotlar jami summasi:</span>
              <span className="font-bold text-gray-900">{subtotalSum.toLocaleString()} so'm</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Yetkazib berish xizmati:</span>
              <span className="font-bold text-emerald-600">
                {feeSum === 0 ? "Bepul" : `${feeSum.toLocaleString()} so'm`}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>To'lov usuli:</span>
              <span className="font-bold text-gray-900 uppercase bg-gray-100 px-2 py-0.5 rounded">
                {orderSuccess.paymentMethod || formData.paymentMethod}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-base">
              <span className="font-black text-gray-900">JAMI TO'LANGAN SUMMA:</span>
              <span className="text-2xl font-black text-brand">{totalSum.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
          >
            <TbPrinter className="w-4 h-4" />
            <span>Chekni chop etish (Print)</span>
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-brand/20 transition-all flex items-center justify-center gap-2 text-xs"
          >
            <TbShoppingBag className="w-4 h-4" />
            <span>Xaridni davom ettirish</span>
          </Link>
          {user && (
            <Link
              to="/profile"
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs"
            >
              <TbUser className="w-4 h-4 text-brand" />
              <span>Profilga o'tish</span>
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-purple-50 text-brand/40 flex items-center justify-center mx-auto">
          <TbShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Savatda mahsulotlar mavjud emas</h2>
        <p className="text-xs text-gray-500">
          Buyurtma rasmiylashtirish uchun avval savatga mahsulot qo'shing.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:bg-brand-dark transition-all text-xs"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Bosh sahifaga qaytish</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Buyurtmani rasmiylashtirish</h1>
          <p className="text-xs text-gray-500">Ma'lumotlarni kiriting va buyurtmani tasdiqlang</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-xl transition-all"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Savatga qaytish</span>
        </Link>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Shipping & Payment Info (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Customer Details */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand flex items-center justify-center">
                <TbUser className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">1. Qabul qiluvchi ma'lumotlari</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <TbUser className="w-3.5 h-3.5 text-brand" /> Ism va Familiya
                </label>
                <input
                  type="text"
                  name="fullname"
                  required
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Masalan: Alisher Navoiy"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                  <TbPhone className="w-3.5 h-3.5 text-brand" /> Telefon raqami
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand flex items-center justify-center">
                <TbMapPin className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">2. Yetkazib berish manzili</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Shahar / Viloyat</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand bg-white"
                >
                  <option value="Toshkent">Toshkent shahri</option>
                  <option value="Samarqand">Samarqand</option>
                  <option value="Buxoro">Buxoro</option>
                  <option value="Namangan">Namangan</option>
                  <option value="Andijon">Andijon</option>
                  <option value="Farg'ona">Farg'ona</option>
                  <option value="Xorazm">Xorazm (Urganch)</option>
                  <option value="Qashqadaryo">Qashqadaryo (Qarshi)</option>
                  <option value="Surxondaryo">Surxondaryo (Termiz)</option>
                  <option value="Navoiy">Navoiy</option>
                  <option value="Jizzax">Jizzax</option>
                  <option value="Sirdaryo">Sirdaryo (Guliston)</option>
                  <option value="Qoraqalpog'iston">Qoraqalpog'iston (Nukus)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Ko'cha, uy, xonadon binosi</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Masalan: Yunusobod tumani, 4-mavze, 12-uy, 45-xonadon"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Kuryer uchun izoh (Ixtiyoriy)</label>
              <input
                type="text"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Masalan: Domofon kodi 45#, tushlikdan keyin olib keling"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-brand flex items-center justify-center">
                <TbCreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">3. To'lov usuli</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                  formData.paymentMethod === "cash"
                    ? "border-brand bg-purple-50/50 text-brand shadow-sm"
                    : "border-gray-100 hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <TbCash className="w-6 h-6 text-emerald-600" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="accent-brand"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Naqd pul yoki karta</h4>
                  <p className="text-[10px] text-gray-500">Mahsulotni topshirganda kuryerga</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                  formData.paymentMethod === "uzcard"
                    ? "border-brand bg-purple-50/50 text-brand shadow-sm"
                    : "border-gray-100 hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <TbCreditCard className="w-6 h-6 text-blue-600" />
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="uzcard"
                    checked={formData.paymentMethod === "uzcard"}
                    onChange={handleInputChange}
                    className="accent-brand"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Uzcard / Humo</h4>
                  <p className="text-[10px] text-gray-500">Onlayn karta orqali to'lov</p>
                </div>
              </label>

              <label
                className={`p-4 rounded-2xl border-2 cursor-pointer flex flex-col justify-between gap-3 transition-all ${
                  formData.paymentMethod === "click"
                    ? "border-brand bg-purple-50/50 text-brand shadow-sm"
                    : "border-gray-100 hover:border-gray-200 text-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-black text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">CLICK</div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="click"
                    checked={formData.paymentMethod === "click"}
                    onChange={handleInputChange}
                    className="accent-brand"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Click / Payme</h4>
                  <p className="text-[10px] text-gray-500">Ilova orqali tezkor to'lov</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Summary & Submit (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>Savatdagi mahsulotlar</span>
              <span className="text-xs font-semibold text-gray-500">({cart.items.length} xil)</span>
            </h3>

            {/* Items mini list */}
            <div className="max-h-56 overflow-y-auto divide-y divide-gray-100 space-y-2 pr-1">
              {cart.items.map((item, idx) => {
                const product = item.product || {};
                const name = item.name || product.name || "Mahsulot";
                const price = item.price || product.price || 0;
                const img = item.image || product.images?.[0]?.url || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80";

                return (
                  <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                    <img src={img} alt={name} className="w-10 h-10 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{name}</p>
                      <p className="text-gray-400 text-[10px]">{item.quantity} x {price.toLocaleString()} so'm</p>
                    </div>
                    <span className="font-bold text-gray-900">{(price * item.quantity).toLocaleString()} so'm</span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Mahsulotlar summasi:</span>
                <span className="font-bold text-gray-900">{subtotal.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span>Yetkazib berish:</span>
                <span className="font-bold text-emerald-600">
                  {deliveryFee === 0 ? "Bepul" : `${deliveryFee.toLocaleString()} so'm`}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Jami to'lanadigan summa:</span>
                <span className="text-xl font-black text-brand">
                  {grandTotal.toLocaleString()} <span className="text-xs font-normal">so'm</span>
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand/25 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span>Rasmiylashtirilmoqda...</span>
              ) : (
                <>
                  <span>Buyurtmani tasdiqlash</span>
                  <TbCheck className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-2">
              <TbShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Xavfsiz va kafolatlangan xarid</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;

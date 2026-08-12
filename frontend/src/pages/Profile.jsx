import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import {
  TbUser,
  TbMail,
  TbShield,
  TbShoppingBag,
  TbPrinter,
  TbCheck,
  TbX,
  TbMapPin,
  TbClock
} from "react-icons/tb";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/orders");
        if (data && Array.isArray(data)) {
          setOrders(data);
        }
      } catch (err) {
        console.warn("Fetch user orders error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-fade-in">
      {/* Profile Card Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-brand font-black text-2xl flex items-center justify-center border border-purple-100">
            {user?.fullname?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">{user?.fullname || "Foydalanuvchi"}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
              <TbMail className="w-4 h-4 text-brand" /> {user?.email}
            </p>
          </div>
        </div>

        <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-brand border border-purple-100 flex items-center gap-1">
          <TbShield className="w-4 h-4" />
          {user?.role === "admin" ? "Admin" : user?.role === "seller" ? "Sotuvchi" : "Mijoz"}
        </span>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <TbShoppingBag className="w-6 h-6 text-brand" />
              <span>Mening buyurtmalarim va cheklarim</span>
            </h2>
            <p className="text-xs text-gray-500">Ilgari rasmiylashtirilgan barcha xaridlaringiz</p>
          </div>
          <span className="text-xs bg-purple-50 text-brand font-bold px-3 py-1 rounded-xl">
            {orders.length} ta buyurtma
          </span>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center text-xs text-gray-400">
            Buyurtmalar yuklanmoqda...
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((ord) => {
              const invoiceNo = ord.invoiceNumber || ord._id;
              const dateFormatted = ord.createdAt
                ? new Date(ord.createdAt).toLocaleString("uz-UZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-";

              return (
                <div
                  key={ord._id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div>
                      <span className="text-xs font-black text-brand bg-purple-50 px-2.5 py-1 rounded-lg">
                        {invoiceNo}
                      </span>
                      <span className="text-[11px] text-gray-400 ml-2">{dateFormatted}</span>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        ord.orderStatus === "delivered"
                          ? "bg-emerald-50 text-emerald-600"
                          : ord.orderStatus === "cancelled"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {ord.orderStatus || "pending"}
                    </span>
                  </div>

                  {/* Items mini summary */}
                  <div className="divide-y divide-gray-50">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-800">
                          {it.quantity}x {it.name || it.product?.name || "Mahsulot"}
                        </span>
                        <span className="font-bold text-gray-900">
                          {(Number(it.price || 0) * Number(it.quantity || 1)).toLocaleString()} so'm
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Jami to'lov:</span>
                      <span className="text-lg font-black text-brand">
                        {(ord.total || 0).toLocaleString()} so'm
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedOrderReceipt(ord)}
                      className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <TbPrinter className="w-4 h-4" />
                      <span>Chekni ko'rish / Print</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
            <TbShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-800">Hozircha buyurtmalar yo'q</h3>
            <p className="text-xs text-gray-500">
              Onlayn do'kondan biror mahsulot xarid qilsangiz, cheklaringiz shu yerda ko'rinadi.
            </p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-scale-up">
            <button
              onClick={() => setSelectedOrderReceipt(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
            >
              <TbX className="w-5 h-5" />
            </button>

            {/* Chek Card Header */}
            <div className="flex justify-between items-start border-b border-dashed pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">lumo<span className="text-brand">market</span></h3>
                <p className="text-[10px] text-gray-400">Rasmiy xarid cheki (Kvitansiya)</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-bold text-gray-900">{selectedOrderReceipt.invoiceNumber || selectedOrderReceipt._id}</p>
                <p className="text-[10px] text-gray-400">
                  {selectedOrderReceipt.createdAt ? new Date(selectedOrderReceipt.createdAt).toLocaleString("uz-UZ") : "-"}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-gray-500 uppercase text-[10px]">Mahsulotlar:</h4>
              <div className="border rounded-2xl overflow-hidden divide-y divide-gray-100">
                {selectedOrderReceipt.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-900">{it.name || "Mahsulot"}</p>
                      <p className="text-[10px] text-gray-400">{it.quantity} x {Number(it.price || 0).toLocaleString()} so'm</p>
                    </div>
                    <span className="font-bold text-gray-900">
                      {(Number(it.price || 0) * Number(it.quantity || 1)).toLocaleString()} so'm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-dashed pt-4 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Oradagi summa:</span>
                <span className="font-bold text-gray-900">{(selectedOrderReceipt.subtotal || 0).toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span>Yetkazib berish:</span>
                <span className="font-bold text-emerald-600">
                  {(selectedOrderReceipt.shippingFee || 0) === 0 ? "Bepul" : `${selectedOrderReceipt.shippingFee?.toLocaleString()} so'm`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t text-sm font-black text-gray-900">
                <span>Jami:</span>
                <span className="text-brand">{(selectedOrderReceipt.total || 0).toLocaleString()} so'm</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <TbPrinter className="w-4 h-4" />
              <span>Chop etish (Print)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

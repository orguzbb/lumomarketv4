import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
  TbLayoutDashboard,
  TbPackage,
  TbPhoto,
  TbSettings,
  TbPlus,
  TbPencil,
  TbTrash,
  TbCheck,
  TbX,
  TbSearch,
  TbUsers,
  TbBuildingStore,
  TbShoppingBag,
  TbPhone,
  TbBrandTelegram,
  TbBrandInstagram,
  TbBrandFacebook,
  TbBrandYoutube,
  TbMail
} from "react-icons/tb";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Stats State
  const [stats, setStats] = useState({ users: 0, sellers: 0, products: 0, orders: 0 });

  // Products CRUD State
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    stock: 10,
    category: "clothing",
    image: "",
    description: ""
  });

  // Banners CRUD State
  const [banners, setBanners] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    highlight: "",
    subtitle: "",
    tag: "",
    image: "",
    bgGradient: "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]",
    isActive: true
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    phone: "+998 88 900 80 81",
    telegram: "https://t.me/lumomarket",
    instagram: "https://instagram.com/lumomarket",
    facebook: "https://facebook.com/lumomarket",
    youtube: "https://youtube.com/lumomarket",
    email: "support@lumomarket.uz"
  });

  useEffect(() => {
    fetchStats();
    fetchProducts();
    fetchBanners();
    fetchSettings();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/overview");
      if (data) setStats(data);
    } catch (e) {
      console.warn("Fetch stats error", e);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get("/admin/products");
      if (data) setProducts(data);
    } catch (e) {
      console.warn("Fetch products error", e);
    }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/admin/banners");
      if (data) setBanners(data);
    } catch (e) {
      console.warn("Fetch banners error", e);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/settings");
      if (data) setSettingsForm(data);
    } catch (e) {
      console.warn("Fetch settings error", e);
    }
  };

  // Product CRUD Handlers
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name || "",
        price: prod.price || "",
        oldPrice: prod.oldPrice || "",
        stock: prod.stock || 10,
        category: prod.category?._id || prod.category || "clothing",
        image: prod.images?.[0]?.url || prod.image || "",
        description: prod.description || ""
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        price: "",
        oldPrice: "",
        stock: 10,
        category: "clothing",
        image: "",
        description: ""
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct._id}`, productForm);
        toast.success("Mahsulot yangilandi!");
      } else {
        await api.post("/admin/products", productForm);
        toast.success("Yangi mahsulot yaratildi!");
      }
      setShowProductModal(false);
      fetchProducts();
      fetchStats();
    } catch (err) {
      toast.error("Mahsulotni saqlashda xatolik yuz berdi");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success("Mahsulot o'chirildi!");
      fetchProducts();
      fetchStats();
    } catch (err) {
      toast.error("Mahsulotni o'chirishda xatolik");
    }
  };

  // Banner CRUD Handlers
  const handleOpenBannerModal = (ban = null) => {
    if (ban) {
      setEditingBanner(ban);
      setBannerForm({
        title: ban.title || "",
        highlight: ban.highlight || "",
        subtitle: ban.subtitle || "",
        tag: ban.tag || "",
        image: ban.image || "",
        bgGradient: ban.bgGradient || "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]",
        isActive: ban.isActive !== undefined ? ban.isActive : true
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: "",
        highlight: "",
        subtitle: "",
        tag: "",
        image: "",
        bgGradient: "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]",
        isActive: true
      });
    }
    setShowBannerModal(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    try {
      if (editingBanner) {
        await api.put(`/admin/banners/${editingBanner._id}`, bannerForm);
        toast.success("Slayder rasmi yangilandi!");
      } else {
        await api.post("/admin/banners", bannerForm);
        toast.success("Yangi slayder rasmi qo'shildi!");
      }
      setShowBannerModal(false);
      fetchBanners();
    } catch (err) {
      toast.error("Bannerni saqlashda xatolik");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Ushbu slayder rasmini o'chirmoqchimisiz?")) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      toast.success("Slayder rasmi o'chirildi!");
      fetchBanners();
    } catch (err) {
      toast.error("O'chirishda xatolik");
    }
  };

  // Settings Handler
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put("/admin/settings", settingsForm);
      toast.success("Sayt sozlamalari va aloqa ma'lumotlari saqlandi!");
    } catch (err) {
      toast.error("Sozlamalarni saqlashda xatolik");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Boshqaruv Paneli</h1>
          <p className="text-xs text-gray-500">Lumo Market v3 tizimini to'liq boshqarish</p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "overview" ? "bg-white text-brand shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TbLayoutDashboard className="w-4 h-4" />
            <span>Statistika</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "products" ? "bg-white text-brand shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TbPackage className="w-4 h-4" />
            <span>Mahsulotlar CRUD</span>
          </button>
          <button
            onClick={() => setActiveTab("banners")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "banners" ? "bg-white text-brand shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TbPhoto className="w-4 h-4" />
            <span>Hero Slider (&lt;&gt;)</span>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "settings" ? "bg-white text-brand shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <TbSettings className="w-4 h-4" />
            <span>Sozlamalar & Aloqa</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Foydalanuvchilar</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.users || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <TbUsers className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Sotuvchilar</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.sellers || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-brand flex items-center justify-center">
                <TbBuildingStore className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Jami Mahsulotlar</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.products || products.length || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TbPackage className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">Buyurtmalar</p>
                <h3 className="text-3xl font-black text-gray-900">{stats.orders || 0}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TbShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS CRUD */}
      {activeTab === "products" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="relative w-full sm:w-80">
              <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Mahsulot nomini qidirish..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand"
              />
            </div>

            <button
              onClick={() => handleOpenProductModal(null)}
              className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <TbPlus className="w-4 h-4" />
              <span>Yangi Mahsulot Qo'shish</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase">
                  <tr>
                    <th className="p-4">Rasm & Mahsulot Nomi</th>
                    <th className="p-4">Narxi</th>
                    <th className="p-4">Eski Narxi</th>
                    <th className="p-4">Zaxira</th>
                    <th className="p-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => {
                      const img = p.images?.[0]?.url || p.image || "https://via.placeholder.com/150";
                      return (
                        <tr key={p._id} className="hover:bg-purple-50/30 transition-colors">
                          <td className="p-4 flex items-center gap-3">
                            <img src={img} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-gray-100" />
                            <span className="font-bold text-gray-900 line-clamp-2 max-w-xs">{p.name}</span>
                          </td>
                          <td className="p-4 font-bold text-brand">{p.price?.toLocaleString()} so'm</td>
                          <td className="p-4 text-gray-400 line-through">{p.oldPrice ? `${p.oldPrice.toLocaleString()} so'm` : "-"}</td>
                          <td className="p-4 font-semibold">{p.stock || 10} ta</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenProductModal(p)}
                                className="p-2 bg-purple-50 text-brand rounded-lg hover:bg-brand hover:text-white transition-colors"
                                title="Tahrirlash"
                              >
                                <TbPencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id)}
                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                title="O'chirish"
                              >
                                <TbTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400">
                        Mahsulotlar topilmadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BANNERS CRUD */}
      {activeTab === "banners" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Bosh sahifa Hero Slayderi (&lt;&gt;)</h3>
              <p className="text-xs text-gray-500">Bu yerdan slayder rasmlari va aksiyalarini boshqarasiz</p>
            </div>
            <button
              onClick={() => handleOpenBannerModal(null)}
              className="bg-brand hover:bg-brand-dark text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <TbPlus className="w-4 h-4" />
              <span>Yangi Slayder Rasmi Qo'shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3 relative group">
                <img src={b.image} alt={b.title} className="w-full h-40 object-cover rounded-xl" />
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{b.title}</h4>
                    <span className="text-xs font-bold text-brand bg-purple-50 px-2 py-0.5 rounded">{b.highlight}</span>
                    <p className="text-xs text-gray-500 mt-1">{b.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenBannerModal(b)}
                      className="p-2 text-brand hover:bg-purple-50 rounded-lg transition-colors"
                      title="Tahrirlash"
                    >
                      <TbPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="O'chirish"
                    >
                      <TbTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 max-w-2xl animate-fade-in">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Qo'llab-quvvatlash va Ijtimoiy tarmoqlar</h3>
            <p className="text-xs text-gray-500">Mijozlar bilan aloqa raqami va tarmoq havolalari</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TbPhone className="w-4 h-4 text-brand" /> Qo'llab-quvvatlash telefon raqami
              </label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand font-bold text-gray-900"
                placeholder="+998 88 900 80 81"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TbMail className="w-4 h-4 text-brand" /> Qo'llab-quvvatlash Email
              </label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand"
                placeholder="support@lumomarket.uz"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TbBrandTelegram className="w-4 h-4 text-blue-500" /> Telegram Havola
              </label>
              <input
                type="text"
                value={settingsForm.telegram}
                onChange={(e) => setSettingsForm({ ...settingsForm, telegram: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TbBrandInstagram className="w-4 h-4 text-pink-500" /> Instagram Havola
              </label>
              <input
                type="text"
                value={settingsForm.instagram}
                onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TbBrandFacebook className="w-4 h-4 text-blue-700" /> Facebook Havola
              </label>
              <input
                type="text"
                value={settingsForm.facebook}
                onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <TbBrandYoutube className="w-4 h-4 text-red-600" /> YouTube Havola
              </label>
              <input
                type="text"
                value={settingsForm.youtube}
                onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl shadow-md transition-colors"
          >
            Sozlamalarni Saqlash
          </button>
        </form>
      )}

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">{editingProduct ? "Mahsulotni Tahrirlash" : "Yangi Mahsulot Qo'shish"}</h3>
              <button type="button" onClick={() => setShowProductModal(false)} className="text-gray-400 hover:text-gray-600"><TbX className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mahsulot Nomi</label>
              <input type="text" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Narxi (so'm)</label>
                <input type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Eski Narxi (so'm)</label>
                <input type="number" value={productForm.oldPrice} onChange={(e) => setProductForm({ ...productForm, oldPrice: Number(e.target.value) })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Rasm URL Manzili</label>
              <input type="text" required value={productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-dark">Saqlash</button>
          </form>
        </div>
      )}

      {/* Banner Create/Edit Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSaveBanner} className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-gray-900">{editingBanner ? "Slayder Rasmini Tahrirlash" : "Yangi Slayder Rasmi Qo'shish"}</h3>
              <button type="button" onClick={() => setShowBannerModal(false)} className="text-gray-400 hover:text-gray-600"><TbX className="w-5 h-5" /></button>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sarlavha (Title)</label>
              <input type="text" required value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" placeholder="Brend mahsulotlariga" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Chegirma belgisi (Highlight)</label>
              <input type="text" value={bannerForm.highlight} onChange={(e) => setBannerForm({ ...bannerForm, highlight: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" placeholder="-15% chegirma" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Izoh (Subtitle)</label>
              <input type="text" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" placeholder="Amerikada ishlab chiqarilgan vitaminlar" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Slayd Rasm URL Manzili</label>
              <input type="text" required value={bannerForm.image} onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:border-brand" placeholder="https://..." />
            </div>
            <button type="submit" className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-dark">Saqlash</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

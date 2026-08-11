import { useState, useEffect } from "react";
import api from "../../api/axios";
const SellerDashboard = () => {
  const [stats, setStats] = useState({});
  useEffect(() => {
    api.get("/seller/overview").then((res) => setStats(res.data));
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Sotuvchi Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Mahsulotlar</h2>
          <p className="text-3xl font-bold">{stats.products || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Buyurtmalar</h2>
          <p className="text-3xl font-bold">{stats.orders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl">Daromad</h2>
          <p className="text-3xl font-bold">{stats.revenue || 0} so'm</p>
        </div>
      </div>
    </div>
  );
};
export default SellerDashboard;

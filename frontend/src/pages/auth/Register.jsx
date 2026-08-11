import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  TbUser,
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbArrowRight,
  TbShieldCheck,
  TbCheck
} from "react-icons/tb";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(fullname, email, password);
      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header Tab Switcher */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-white p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand text-white font-black text-xl flex items-center justify-center shadow-md shadow-brand/30">
              L
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              lumo<span className="text-brand">market</span>
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-2xl">
            <Link
              to="/login"
              className="py-2.5 rounded-xl font-bold text-xs text-gray-600 hover:text-gray-900 text-center transition-colors"
            >
              Tizimga kirish
            </Link>
            <button className="py-2.5 rounded-xl font-bold text-xs bg-white text-brand shadow-sm">
              Ro'yxatdan o'tish
            </button>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-gray-900">Yangi hisob yaratish</h2>
            <p className="text-xs text-gray-500">
              Barcha qulayliklar va chegirmalardan foydalanish uchun ro'yxatdan o'ting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fullname Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">To'liq ismingiz</label>
              <div className="relative">
                <TbUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Ism va familiyangiz"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  required
                  minLength={2}
                  maxLength={80}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Email Manzilingiz</label>
              <div className="relative">
                <TbMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="masalan: foydalanuvchi@mail.uz"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Parol Yarating</label>
              <div className="relative">
                <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 8 ta belgi"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <TbEyeOff className="w-5 h-5" /> : <TbEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Rules */}
            <div className="space-y-1 text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                <TbCheck className="w-3.5 h-3.5" />
                <span>Kamida 8 ta belgi bo'lishi lozim</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}</span>
              <TbArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-xs text-gray-500 pt-2">
            Hisobingiz bormi?{" "}
            <Link to="/login" className="text-brand font-bold hover:underline">
              Tizimga kirish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

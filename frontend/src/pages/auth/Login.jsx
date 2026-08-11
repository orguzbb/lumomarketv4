import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  TbMail,
  TbLock,
  TbEye,
  TbEyeOff,
  TbBrandGoogle,
  TbArrowRight,
  TbShieldCheck,
  TbUserCheck
} from "react-icons/tb";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Google orqali tizimga kirdingiz!");
      navigate("/");
    } catch (err) {
      toast.error("Google orqali kirishda xatolik yuz berdi");
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
            <button className="py-2.5 rounded-xl font-bold text-xs bg-white text-brand shadow-sm">
              Tizimga kirish
            </button>
            <Link
              to="/register"
              className="py-2.5 rounded-xl font-bold text-xs text-gray-600 hover:text-gray-900 text-center transition-colors"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-gray-900">Xush kelibsiz!</h2>
            <p className="text-xs text-gray-500">
              Xaridorlar, Sotuvchilar va Adminlar uchun yagona kirish
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700">Email Manzil</label>
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
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700">Parol</label>
                <a href="#forgot" className="text-[11px] font-semibold text-brand hover:underline">
                  Parolni unutdingizmi?
                </a>
              </div>
              <div className="relative">
                <TbLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parolingizni kiriting"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                  required
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? "Kirilmoqda..." : "Tizimga kirish"}</span>
              <TbArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-gray-400 font-semibold uppercase absolute">
              Yoki
            </span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 border border-gray-200 rounded-xl flex items-center justify-center gap-2.5 text-xs transition-colors"
          >
            <TbBrandGoogle className="w-5 h-5 text-red-500" />
            <span>Google orqali kirish</span>
          </button>

          {/* Security Badge */}
          <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <TbShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-bit SSL bilan himoyalangan va xavfsiz tizim</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

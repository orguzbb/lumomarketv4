import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  TbBrandTelegram,
  TbBrandInstagram,
  TbBrandFacebook,
  TbBrandYoutube,
  TbHeadphones,
  TbMail,
  TbShieldCheck,
  TbTruckReturn,
  TbClock24
} from "react-icons/tb";

const Footer = () => {
  const [settings, setSettings] = useState({
    phone: "+998 88 900 80 81",
    telegram: "https://t.me/lumomarket",
    instagram: "https://instagram.com/lumomarket",
    facebook: "https://facebook.com/lumomarket",
    youtube: "https://youtube.com/lumomarket",
    email: "support@lumomarket.uz"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/settings");
        if (data) setSettings(data);
      } catch (e) {
        console.warn("Using default settings", e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600 text-sm">
      {/* Advantage Features Banner */}
      <div className="bg-purple-50/60 border-b border-purple-100/60 py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
              <TbClock24 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">1 kunda yetkazib berish</h4>
              <p className="text-xs text-gray-500">O'zbekiston bo'ylab tezkor yetkazish</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
              <TbShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Xavfsiz to'lov</h4>
              <p className="text-xs text-gray-500">Uzcard, Humo, Visa va Naqd pul</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
              <TbTruckReturn className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Oson qaytarish</h4>
              <p className="text-xs text-gray-500">10 kun ichida tovarni qaytarish</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-purple-100">
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
              <TbHeadphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">24/7 Qo'llab-quvvatlash</h4>
              <p className="text-xs text-gray-500">Doimiy aloqadamiz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Us */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand text-white font-black text-lg flex items-center justify-center">
              L
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              lumo<span className="text-brand">market</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 leading-relaxed">
            O'zbekistondagi eng qulay va hamyonbop onlayn marketplace. Har kuni minglab sifatli mahsulotlar va arzon narxlar!
          </p>
          <div className="flex items-center gap-3">
            {settings.telegram && (
              <a href={settings.telegram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-brand hover:text-white flex items-center justify-center transition-colors">
                <TbBrandTelegram className="w-5 h-5" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-brand hover:text-white flex items-center justify-center transition-colors">
                <TbBrandInstagram className="w-5 h-5" />
              </a>
            )}
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-brand hover:text-white flex items-center justify-center transition-colors">
                <TbBrandFacebook className="w-5 h-5" />
              </a>
            )}
            {settings.youtube && (
              <a href={settings.youtube} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-gray-100 hover:bg-brand hover:text-white flex items-center justify-center transition-colors">
                <TbBrandYoutube className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 text-sm">Foydalanuvchilarga</h4>
          <ul className="space-y-2 text-xs text-gray-500">
            <li><a href="#faq" className="hover:text-brand transition-colors">Savol-javoblar</a></li>
            <li><a href="#delivery" className="hover:text-brand transition-colors">Yetkazib berish va topshirish punktlari</a></li>
            <li><a href="#returns" className="hover:text-brand transition-colors">Tovarlarni qaytarish</a></li>
            <li><a href="#payment" className="hover:text-brand transition-colors">Bo'lib to'lash shartlari</a></li>
          </ul>
        </div>

        {/* For Sellers */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 text-sm">Tadbirkorlarga</h4>
          <ul className="space-y-2 text-xs text-gray-500">
            <li><a href="#sell" className="hover:text-brand transition-colors">Lumo Marketda sotish</a></li>
            <li><a href="#seller-cabinet" className="hover:text-brand transition-colors">Sotuvchi kabinetiga kirish</a></li>
            <li><a href="#fulfillment" className="hover:text-brand transition-colors">Fulfillment markazi</a></li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-900 text-sm">Aloqa</h4>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <TbHeadphones className="w-4 h-4 text-brand" />
              <span className="font-bold text-gray-900">{settings.phone || "+998 88 900 80 81"}</span>
            </div>
            <div className="flex items-center gap-2">
              <TbMail className="w-4 h-4 text-brand" />
              <span>{settings.email || "support@lumomarket.uz"}</span>
            </div>
          </div>
          
          <div className="pt-2">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Qabul qilinadigan to'lovlar:</h5>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded font-bold text-[10px]">UZCARD</span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">HUMO</span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">VISA</span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">MASTERCARD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-100 bg-gray-50 py-4 text-center text-xs text-gray-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Lumo Market V3. Barcha huquqlar himoyalangan.</span>
          <span>Maxfiylik kelishuvi | Foydalanish shartlari</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import {
  TbShirt,
  TbSparkles,
  TbDeviceMobile,
  TbHome,
  TbClock,
  TbDeviceTv,
  TbBallFootball,
  TbCar,
  TbBook,
  TbBabyCarriage,
  TbHeart,
  TbX,
  TbChevronRight
} from "react-icons/tb";
import { Link } from "react-router-dom";

export const CATEGORIES_WITH_SVGS = [
  { id: "electronics", name: "Elektronika va gadjetlar", icon: TbDeviceMobile, count: "12,400+ mahsulot", popular: true },
  { id: "appliances", name: "Maishiy texnika", icon: TbDeviceTv, count: "5,800+ mahsulot", popular: true },
  { id: "clothing", name: "Kiyim va poyabzal", icon: TbShirt, count: "34,200+ mahsulot", popular: true },
  { id: "beauty", name: "Goʻzallik va parvarish", icon: TbSparkles, count: "8,900+ mahsulot", popular: true },
  { id: "home", name: "Uy va roʻzgʻor buyumlari", icon: TbHome, count: "18,100+ mahsulot", popular: false },
  { id: "accessories", name: "Soatlar va aksessuarlar", icon: TbClock, count: "7,300+ mahsulot", popular: false },
  { id: "sports", name: "Sport va hordiq", icon: TbBallFootball, count: "4,600+ mahsulot", popular: false },
  { id: "auto", name: "Avtotovarlar", icon: TbCar, count: "6,200+ mahsulot", popular: false },
  { id: "kids", name: "Bolalar tovarlari", icon: TbBabyCarriage, count: "9,500+ mahsulot", popular: false },
  { id: "books", name: "Kitoblar va kantselyariya", icon: TbBook, count: "11,000+ mahsulot", popular: false },
  { id: "health", name: "Salomatlik va dori-darmon", icon: TbHeart, count: "3,900+ mahsulot", popular: false }
];

const CatalogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[80vh] border border-gray-100 animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-white to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
              <TbShirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Mahsulotlar katalogi</h3>
              <p className="text-xs text-gray-500">Barcha kategoriyalar bo'yicha saralangan tovarlar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES_WITH_SVGS.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                onClick={onClose}
                className="group p-4 rounded-2xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 group-hover:bg-brand text-brand group-hover:text-white flex items-center justify-center transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 group-hover:text-brand transition-colors">
                      {cat.name}
                    </h4>
                    <span className="text-xs text-gray-400">{cat.count}</span>
                  </div>
                </div>
                <TbChevronRight className="w-5 h-5 text-gray-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500 px-6">
          <span>Har kuni 10 000+ yangi mahsulotlar qo'shiladi</span>
          <span className="font-semibold text-brand">Lumo Market katalogi</span>
        </div>
      </div>
    </div>
  );
};

export default CatalogModal;

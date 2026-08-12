import React from "react";
import { useTranslation } from "react-i18next";
import { TbX, TbCheck, TbTruck, TbShieldCheck, TbCreditCard } from "react-icons/tb";

const BannerDetailModal = ({ banner, onClose, onBrowse }) => {
  const { t } = useTranslation();

  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-100 transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header Image */}
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-purple-900 to-brand flex items-center justify-center overflow-hidden">
          {banner.image ? (
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="text-white text-center p-6">
              <h2 className="text-3xl font-black">{banner.title}</h2>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            {banner.tag && (
              <span className="bg-yellow-400 text-purple-950 font-black text-xs px-3 py-1 rounded-full self-start mb-2 shadow">
                {banner.tag}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {banner.title}
            </h2>
            {banner.highlight && (
              <p className="text-yellow-300 text-lg font-black mt-1">
                {banner.highlight}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-md"
          >
            <TbX className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {banner.subtitle && (
            <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
              {banner.subtitle}
            </p>
          )}

          {/* Highlights & Features */}
          <div className="space-y-3 bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
            <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <TbShieldCheck className="w-5 h-5 text-brand" />
              <span>{t("termsAndConditions")}</span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <TbCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{t("term1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <TbCreditCard className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>{t("term2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <TbTruck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{t("term3")}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {t("close")}
            </button>
            <button
              onClick={() => {
                onClose();
                if (onBrowse) onBrowse();
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/20 transition-all active:scale-95"
            >
              {t("browseProducts")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDetailModal;

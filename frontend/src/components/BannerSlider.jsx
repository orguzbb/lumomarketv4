import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TbChevronLeft, TbChevronRight, TbPackage } from "react-icons/tb";
import BannerDetailModal from "./BannerDetailModal";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const DEFAULT_SLIDES = [
  {
    _id: "1",
    title: "Katta mavsumiy chegirmalar",
    highlight: "-30% gacha arzon",
    subtitle: "Kiyim-kechak, elektronika va barcha turdagi sifatli mahsulotlar",
    tag: "Super Aksiya",
    bgGradient: "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]",
    textColor: "text-[#1E293B]",
    tagBg: "bg-white text-slate-800",
    buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    categoryId: "clothing"
  },
  {
    _id: "2",
    title: "Smartfonlar va gadjetlar",
    highlight: "Muddatli to'lov 0-0-12",
    subtitle: "Boshlang'ich to'lovsiz, 12 oyga bo'lib to'lang",
    tag: "Rasmiy kafolat 1 yil",
    bgGradient: "from-[#F7F0FF] via-[#EDDCFF] to-[#E2C4FF]",
    textColor: "text-[#2E1065]",
    tagBg: "bg-white text-purple-900",
    buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    categoryId: "electronics"
  },
  {
    _id: "3",
    title: "Simsiz TWS quloqchinlar",
    highlight: "-30% Super narx",
    subtitle: "Shovqin so'ndiruvchi zamonaviy akustika",
    tag: "Top sotuv",
    bgGradient: "from-[#F0F5FF] via-[#E1EAFF] to-[#D0DFFF]",
    textColor: "text-[#0F172A]",
    tagBg: "bg-white text-blue-900",
    buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    categoryId: "accessories"
  },
  {
    _id: "4",
    title: "Uy va oshxona texnikalari",
    highlight: "Bepul etkazish",
    subtitle: "Barcha maishiy texnikalarga super arzon narxlar",
    tag: "Super narx kafolati",
    bgGradient: "from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]",
    textColor: "text-[#064E3B]",
    tagBg: "bg-white text-emerald-900",
    buttonBg: "bg-[#7000FF] hover:bg-[#5B00D6] text-white",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80",
    categoryId: "appliances"
  }
];

const BannerSlider = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageFailed, setImageFailed] = useState({});
  const [selectedDetailBanner, setSelectedDetailBanner] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get("/banners");
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (e) {
        console.warn("Using default slides", e);
      }
    };
    fetchBanners();
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Autoplay
  useEffect(() => {
    if (isPaused || slides.length <= 1 || selectedDetailBanner) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, slides.length, selectedDetailBanner]);

  const slide = slides[currentIndex] || DEFAULT_SLIDES[0];

  const bgGradient = slide.bgGradient || "from-[#FBF3E8] via-[#F9EBD8] to-[#F5DEC0]";
  const tagBg = slide.tagBg || "bg-white text-slate-800";
  const textColor = slide.textColor || "text-[#1E293B]";
  const buttonBg = slide.buttonBg || "bg-[#7000FF] hover:bg-[#5B00D6] text-white";

  const handleImageError = (id) => {
    setImageFailed((prev) => ({ ...prev, [id]: true }));
  };

  const handleBrowseCategory = () => {
    if (slide.categoryId) {
      navigate(`/category/${slide.categoryId}`);
    } else {
      navigate("/category/all");
    }
  };

  return (
    <>
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full rounded-3xl overflow-hidden shadow-lg border border-gray-100 group transition-all duration-300"
      >
        {/* Slider Content */}
        <div
          className={`w-full min-h-[320px] sm:min-h-[380px] md:min-h-[420px] bg-gradient-to-r ${bgGradient} flex items-center justify-between p-6 sm:p-10 md:p-12 transition-all duration-700 ease-in-out`}
        >
          {/* Left Text Portion */}
          <div className="max-w-lg space-y-4 z-10">
            {/* Tag */}
            {slide.tag && (
              <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm ${tagBg}`}>
                {slide.tag}
              </span>
            )}

            {/* Title */}
            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${textColor}`}>
                {slide.title}
              </h2>
              {slide.highlight && (
                <div className="text-2xl sm:text-4xl md:text-5xl font-black text-[#7000FF] bg-yellow-300 inline-block px-3 py-1 rounded-xl shadow-sm">
                  {slide.highlight}
                </div>
              )}
            </div>

            {/* Subtitle */}
            {slide.subtitle && (
              <p className="text-sm sm:text-base font-medium text-gray-700 opacity-90">
                {slide.subtitle}
              </p>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedDetailBanner(slide)}
                className={`px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${buttonBg}`}
              >
                {t("viewDetails")}
              </button>
            </div>
          </div>

          {/* Right Image Portion */}
          <div className="hidden sm:block w-1/2 md:w-5/12 h-[260px] md:h-[340px] relative rounded-2xl overflow-hidden shadow-xl bg-white/40 backdrop-blur-md">
            {slide.image && !imageFailed[slide._id || currentIndex] ? (
              <img
                src={slide.image}
                alt={slide.title}
                onError={() => handleImageError(slide._id || currentIndex)}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-brand bg-white/60">
                <TbPackage className="w-16 h-16 mb-2" />
                <span className="text-xs font-bold text-gray-700 text-center">{slide.title}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Navigation Arrow Controls (< and >) */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              aria-label="Oldingi slayd"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg backdrop-blur-md flex items-center justify-center border border-gray-100 opacity-80 group-hover:opacity-100 transition-all transform hover:scale-110 active:scale-95 z-20"
            >
              <TbChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Keyingi slayd"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-lg backdrop-blur-md flex items-center justify-center border border-gray-100 opacity-80 group-hover:opacity-100 transition-all transform hover:scale-110 active:scale-95 z-20"
            >
              <TbChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
            {slides.map((s, idx) => (
              <button
                key={s._id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-7 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Slayd ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Banner Details Modal */}
      {selectedDetailBanner && (
        <BannerDetailModal
          banner={selectedDetailBanner}
          onClose={() => setSelectedDetailBanner(null)}
          onBrowse={handleBrowseCategory}
        />
      )}
    </>
  );
};

export default BannerSlider;

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TbChevronDown, TbCheck } from "react-icons/tb";

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", flag: "🇺🇿", short: "UZ" },
  { code: "ru", label: "Русский", flag: "🇷🇺", short: "RU" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" }
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-white hover:bg-gray-100/80 border border-gray-200/90 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20 active:scale-95"
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span>{currentLang.label}</span>
        <TbChevronDown
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-purple-50 text-brand font-bold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm leading-none">{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
                {isSelected && <TbCheck className="w-4 h-4 text-brand stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

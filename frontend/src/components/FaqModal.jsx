import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  TbX,
  TbHelpCircle,
  TbSparkles,
  TbChevronDown,
  TbSend,
  TbRobot,
  TbUser,
  TbCheck,
  TbTruck,
  TbCreditCard,
  TbArrowBackUp,
  TbBuildingStore
} from "react-icons/tb";

const GROQ_API_KEY =
  import.meta.env.VITE_GROQ_API_KEY ||
  atob("Z3NrX2I1OE9vb2hDRTB1bVA5YzVVTjB2V0dkeWJyUVlFYnFpSnByYTB1WnU2TFU0Zzc5Z3Zkc1o=");

const FaqModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("faq"); // "faq" | "ai"
  const [openAccordion, setOpenAccordion] = useState(0);

  // AI Chat state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        i18n.language === "ru"
          ? "Здравствуйте! Я AI ассистент Lumo Market. Чем я могу вам помочь по нашему маркетплейсу (товары, доставка, оплата, рассрочка, возврат)?"
          : i18n.language === "en"
          ? "Hello! I am Lumo Market AI assistant. How can I help you with our marketplace (products, shipping, payment, installments, returns)?"
          : "Assalomu alaykum! Men Lumo Market sun'iy intellekt yordamchisiman. Marketplace xizmatlarimiz (mahsulotlar, yetkazib berish, to'lov, bo'lib to'lash, qaytarish) bo'yicha qanday yordam bera olaman?"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const faqItems = [
    {
      q: t("q1"),
      a: t("a1"),
      icon: TbTruck
    },
    {
      q: t("q2"),
      a: t("a2"),
      icon: TbCreditCard
    },
    {
      q: t("q3"),
      a: t("a3"),
      icon: TbArrowBackUp
    },
    {
      q: t("q4"),
      a: t("a4"),
      icon: TbCheck
    },
    {
      q: t("q5"),
      a: t("a5"),
      icon: TbBuildingStore
    }
  ];

  const handleSendAi = async (e) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query || isAiLoading) return;

    const newMessages = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInputQuery("");
    setIsAiLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `Siz "Lumo Market v3" onlayn marketplace platfomasining rasmiy yordamchi AI assistentisiz. 
Siz FAQT USHBU LOYIHA (Lumo Market: mahsulotlar, arzon narxlar, yetkazib berish, 0-0-12 bo'lib to'lash, to'lov usullari Uzcard/Humo/Visa/Naqd, 10 kun ichida qaytarish, sotuvchi bo'lish, buyurtma berish) bo'yicha savollarga javob berasiz. 
AGAR foydalanuvchi loyihaga aloqador bo'lmagan (masalan: umumiy bilimlar, Pifagor teoremasi, boshqa saytlar, dasturlash yoki ma'nosiz) savol bersa, ularga muloyimlik bilan FAQT Lumo Market loyihasi va uning xizmatlari bo'yicha savollarga javob bera olishingizni ta'kidlab, javob berishni rad eting.
Foydalanuvchining joriy tili: ${i18n.language}. Javobingiz loqayd bo'lmasin va o'ta do'stona, tushunarli hamda aniq bo'lsin.`
            },
            ...newMessages.map((m) => ({ role: m.role, content: m.content }))
          ],
          temperature: 0.5,
          max_tokens: 600
        })
      });

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        (i18n.language === "ru"
          ? "К сожалению, произошла ошибка связи с AI."
          : i18n.language === "en"
          ? "Sorry, communication error with AI."
          : "Kechirasiz, javob olishda xatolik yuz berdi.");

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Groq AI Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            i18n.language === "ru"
              ? "Сервер AI временно недоступен. Пожалуйста, попробуйте еще раз."
              : i18n.language === "en"
              ? "AI server temporarily unavailable. Please try again."
              : "AI serveri bilan bog'lanib bo'lmadi. Iltimos qaytadan urinib ko'ring."
        }
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full h-[600px] flex flex-col overflow-hidden shadow-2xl border border-gray-100 transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-brand to-purple-800 p-6 text-white relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <TbX className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-purple-950 flex items-center justify-center font-black">
              <TbHelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">{t("faqTitle")}</h2>
              <p className="text-xs text-purple-200">{t("faqSubtitle")}</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 bg-white/10 p-1 rounded-2xl backdrop-blur-md">
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "faq"
                  ? "bg-white text-brand shadow-md"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <TbHelpCircle className="w-4 h-4" />
              <span>{t("tabFaq")}</span>
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "ai"
                  ? "bg-yellow-400 text-purple-950 shadow-md"
                  : "text-purple-100 hover:bg-white/10"
              }`}
            >
              <TbSparkles className="w-4 h-4 text-purple-950" />
              <span>{t("tabAi")}</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === "faq" ? (
            /* Accordion Tab */
            <div className="space-y-3">
              {faqItems.map((item, idx) => {
                const Icon = item.icon;
                const isOpen = openAccordion === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm transition-all"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                      className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-purple-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-brand flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-gray-900">
                          {item.q}
                        </span>
                      </div>
                      <TbChevronDown
                        className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-purple-50/30">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* AI Chatbot Tab */
            <div className="h-full flex flex-col">
              <div className="bg-amber-50 border border-amber-200/70 text-amber-900 text-[11px] p-2.5 rounded-xl mb-3 flex items-center gap-2">
                <TbSparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>{t("aiDisclaimer")}</span>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        msg.role === "user"
                          ? "bg-brand text-white"
                          : "bg-purple-900 text-yellow-300"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <TbUser className="w-4 h-4" />
                      ) : (
                        <TbRobot className="w-4 h-4" />
                      )}
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-brand text-white rounded-tr-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 italic p-2 bg-white rounded-xl border border-gray-100 w-fit">
                    <TbSparkles className="w-4 h-4 text-brand animate-spin" />
                    <span>{t("aiThinking")}</span>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendAi} className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={t("aiInputPlaceholder")}
                  className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-800 outline-none focus:ring-2 focus:ring-brand/30 shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isAiLoading}
                  className="bg-brand hover:bg-brand-dark disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
                >
                  <TbSend className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqModal;

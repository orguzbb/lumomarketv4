import React, { useState } from "react";
import { useLocation } from "../context/LocationContext";
import { TbMapPin, TbSearch, TbX, TbCheck } from "react-icons/tb";

const RegionModal = () => {
  const { isModalOpen, closeModal, selectedLocation, selectRegion, regions } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isModalOpen) return null;

  const filteredRegions = regions.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand">
              <TbMapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Yetkazib berish shahrini tanlang</h3>
              <p className="text-xs text-gray-500">Buyurtmangiz mos narx va muddatda yetkazilishi uchun shaharni tanlang</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <TbX className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <TbSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Shaharni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
            />
          </div>
        </div>

        {/* Region List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-gray-50">
          {filteredRegions.length > 0 ? (
            filteredRegions.map((region) => {
              const isSelected = selectedLocation.id === region.id;
              return (
                <button
                  key={region.id}
                  onClick={() => selectRegion(region)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? "bg-purple-50 text-brand font-semibold"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TbMapPin className={`w-4 h-4 ${isSelected ? "text-brand" : "text-gray-400"}`} />
                    <span className="text-sm">{region.name}</span>
                  </div>
                  {isSelected && <TbCheck className="w-5 h-5 text-brand stroke-[2.5]" />}
                </button>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-400 text-sm">
              Siz qidirgan shahar topilmadi
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs text-gray-500">
          Oʻzbekiston boʻylab 1 kunda bepul yetkazib berish xizmati mavjud
        </div>
      </div>
    </div>
  );
};

export default RegionModal;

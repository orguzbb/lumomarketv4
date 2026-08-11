import React, { createContext, useState, useEffect, useContext } from "react";

export const LocationContext = createContext();

export const UZBEKISTAN_REGIONS = [
  { id: "toshkent-sh", name: "Toshkent shahri", shortName: "Toshkent" },
  { id: "toshkent-v", name: "Toshkent viloyati", shortName: "Toshkent v." },
  { id: "andijon", name: "Andijon viloyati", shortName: "Andijon" },
  { id: "buxoro", name: "Buxoro viloyati", shortName: "Buxoro" },
  { id: "fargona", name: "Fargʻona viloyati", shortName: "Fargʻona" },
  { id: "jizzax", name: "Jizzax viloyati", shortName: "Jizzax" },
  { id: "xorazm", name: "Xorazm viloyati", shortName: "Xorazm" },
  { id: "namangan", name: "Namangan viloyati", shortName: "Namangan" },
  { id: "navoiy", name: "Navoiy viloyati", shortName: "Navoiy" },
  { id: "qashqadaryo", name: "Qashqadaryo viloyati", shortName: "Qashqadaryo" },
  { id: "samarqand", name: "Samarqand viloyati", shortName: "Samarqand" },
  { id: "sirdaryo", name: "Sirdaryo viloyati", shortName: "Sirdaryo" },
  { id: "surxondaryo", name: "Surxondaryo viloyati", shortName: "Surxondaryo" },
  { id: "qoraqalpogiston", name: "Qoraqalpogʻiston Respublikasi", shortName: "Qoraqalpogʻiston" }
];

export const LocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(() => {
    const saved = localStorage.getItem("user_location");
    return saved ? JSON.parse(saved) : UZBEKISTAN_REGIONS[0];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("user_location", JSON.stringify(selectedLocation));
  }, [selectedLocation]);

  const selectRegion = (region) => {
    setSelectedLocation(region);
    setIsModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        selectRegion,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
        regions: UZBEKISTAN_REGIONS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);

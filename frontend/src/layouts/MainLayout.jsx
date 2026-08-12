import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import RegionModal from "../components/RegionModal";
import FaqModal from "../components/FaqModal";

const MainLayout = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#faq") {
        setIsFaqOpen(true);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  const handleCloseFaq = () => {
    setIsFaqOpen(false);
    if (window.location.hash === "#faq") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-neutral text-gray-900 font-sans">
      <Navbar onOpenFaq={() => setIsFaqOpen(true)} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer onOpenFaq={() => setIsFaqOpen(true)} />

      {/* Global Drawer & Modals */}
      <CartDrawer />
      <RegionModal />
      <FaqModal isOpen={isFaqOpen} onClose={handleCloseFaq} />
    </div>
  );
};

export default MainLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import RegionModal from "../components/RegionModal";

const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-warm-neutral text-gray-900 font-sans">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-6">
      <Outlet />
    </main>
    <Footer />
    
    {/* Global Drawer & Modals */}
    <CartDrawer />
    <RegionModal />
  </div>
);

export default MainLayout;

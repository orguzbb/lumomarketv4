import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const CartContext = createContext();

const getOrCreateGuestSessionId = () => {
  let sessionId = localStorage.getItem("guestSessionId");
  if (!sessionId) {
    sessionId = "guest_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now();
    localStorage.setItem("guestSessionId", sessionId);
  }
  return sessionId;
};

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(() => {
    const local = localStorage.getItem("lumo_cart_backup");
    return local ? JSON.parse(local) : { items: [], subtotal: 0 };
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => {
    const headers = {};
    const guestId = getOrCreateGuestSessionId();
    headers["x-guest-session-id"] = guestId;
    return { headers };
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart", getHeaders());
      if (res.data) {
        setCart(res.data);
        localStorage.setItem("lumo_cart_backup", JSON.stringify(res.data));
      }
    } catch (err) {
      console.warn("Failed to fetch cart from server, using local fallback", err);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  // Sync cart when user logs in
  useEffect(() => {
    const syncGuestCartOnAuth = async () => {
      if (user) {
        try {
          await api.post("/cart/sync", {}, getHeaders());
        } catch (e) {
          console.warn("Sync guest cart failed", e);
        }
      }
      fetchCart();
    };
    syncGuestCartOnAuth();
  }, [user, fetchCart, getHeaders]);

  const addToCart = async (product, quantity = 1) => {
    try {
      const productId = product._id || product.id;
      // Optimistic update
      setCart((prevCart) => {
        const existingIndex = prevCart.items.findIndex(
          (i) => (i.product?._id || i.product) === productId
        );
        let updatedItems = [...prevCart.items];
        if (existingIndex > -1) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedItems[existingIndex].quantity + quantity
          };
        } else {
          updatedItems.push({
            product: product,
            quantity,
            price: product.price,
            name: product.name,
            image: product.images?.[0]?.url || product.image || ""
          });
        }
        const subtotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const newCart = { ...prevCart, items: updatedItems, subtotal };
        localStorage.setItem("lumo_cart_backup", JSON.stringify(newCart));
        return newCart;
      });

      toast.success(`${product.name || 'Mahsulot'} savatga qo'shildi!`, {
        icon: '🛍️',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });

      // API call
      const res = await api.post("/cart/items", { productId, quantity }, getHeaders());
      if (res.data) {
        setCart(res.data);
        localStorage.setItem("lumo_cart_backup", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      setCart((prev) => {
        const updatedItems = prev.items.map((i) => {
          const id = i.product?._id || i.product;
          if (id === productId) return { ...i, quantity };
          return i;
        });
        const subtotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const newCart = { ...prev, items: updatedItems, subtotal };
        localStorage.setItem("lumo_cart_backup", JSON.stringify(newCart));
        return newCart;
      });

      const res = await api.patch(`/cart/items/${productId}`, { quantity }, getHeaders());
      if (res.data) {
        setCart(res.data);
        localStorage.setItem("lumo_cart_backup", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCart((prev) => {
        const updatedItems = prev.items.filter((i) => (i.product?._id || i.product) !== productId);
        const subtotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const newCart = { ...prev, items: updatedItems, subtotal };
        localStorage.setItem("lumo_cart_backup", JSON.stringify(newCart));
        return newCart;
      });

      toast("Mahsulot savatdan olib tashlandi", { icon: "🗑️" });

      const res = await api.delete(`/cart/items/${productId}`, getHeaders());
      if (res.data) {
        setCart(res.data);
        localStorage.setItem("lumo_cart_backup", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const clearCart = async () => {
    try {
      setCart({ items: [], subtotal: 0 });
      localStorage.removeItem("lumo_cart_backup");
      await api.delete("/cart", getHeaders());
      toast.success("Savat tozalandi");
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  const totalCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        totalCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        toggleDrawer: () => setIsDrawerOpen((prev) => !prev)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

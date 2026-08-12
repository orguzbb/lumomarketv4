import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState(() => {
    const local = localStorage.getItem("lumo_wishlist_backup");
    return local ? JSON.parse(local) : [];
  });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      if (res.data && Array.isArray(res.data.products)) {
        setWishlist(res.data.products);
        localStorage.setItem("lumo_wishlist_backup", JSON.stringify(res.data.products));
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist from server", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlist.some((item) => {
        const id = typeof item === "object" ? item._id || item.id : item;
        return id === productId;
      });
    },
    [wishlist]
  );

  const toggleWishlist = async (product) => {
    if (!product) return;
    const productId = product._id || product.id;
    const alreadyLiked = isInWishlist(productId);

    if (alreadyLiked) {
      // Remove
      const updated = wishlist.filter((item) => {
        const id = typeof item === "object" ? item._id || item.id : item;
        return id !== productId;
      });
      setWishlist(updated);
      localStorage.setItem("lumo_wishlist_backup", JSON.stringify(updated));

      toast("Saralanganlardan olib tashlandi", { icon: "💔" });

      if (user) {
        try {
          await api.delete(`/wishlist/${productId}`);
        } catch (e) {
          console.warn("Wishlist remove API error", e);
        }
      }
    } else {
      // Add
      const updated = [...wishlist, product];
      setWishlist(updated);
      localStorage.setItem("lumo_wishlist_backup", JSON.stringify(updated));

      toast.success(`${product.name || "Mahsulot"} saralanganlarga qo'shildi!`, {
        icon: "❤️",
        style: {
          borderRadius: "12px",
          background: "#333",
          color: "#fff",
        },
      });

      if (user) {
        try {
          await api.post(`/wishlist/${productId}`);
        } catch (e) {
          console.warn("Wishlist add API error", e);
        }
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    const updated = wishlist.filter((item) => {
      const id = typeof item === "object" ? item._id || item.id : item;
      return id !== productId;
    });
    setWishlist(updated);
    localStorage.setItem("lumo_wishlist_backup", JSON.stringify(updated));

    toast("Saralanganlardan olib tashlandi", { icon: "💔" });

    if (user) {
      try {
        await api.delete(`/wishlist/${productId}`);
      } catch (e) {
        console.warn("Wishlist remove API error", e);
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

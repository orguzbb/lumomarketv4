import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
let app, auth, provider;
if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
}
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const restoreSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      const { data } = await api.get("/auth/session");
      if (data.authenticated) setUser(data.user);
      else localStorage.removeItem("accessToken");
    } catch {
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };
  const register = async (fullname, email, password) => {
    const { data } = await api.post("/auth/register", {
      fullname,
      email,
      password,
    });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };
  const googleLogin = async () => {
    if (!auth) throw new Error("Firebase not configured");
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    const { data } = await api.post("/auth/google", { idToken });
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
    return data;
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    if (auth) await signOut(auth).catch(() => {});
    localStorage.removeItem("accessToken");
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

"use client";
import { createContext, useEffect, useState, useMemo, useContext } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import CryptoJS from "crypto-js";
import { auth, db } from "@/firebase/config";

// Ensure encryption key is defined and accessible
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-secret-key';

// Encryption utility
const EncryptionService = {
  encrypt: (data) => {
    try {
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error("Encryption error:", error);
      return null;
    }
  },

  decrypt: (encryptedData) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  }
};

// Create the context
export const UserContext = createContext({
  userInfo: null,
  loading: true,
  isUserLoggedIn: false
});

// Provider component
export const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // console.log({ isUserLoggedIn, loading });

  const fetchUserData = async (uid) => {
    if (!db) {
      console.warn('Firestore DB not initialized; cannot fetch user data.');
      clearUserData();
      return;
    }

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUserInfo(userData);

        try {
          const encryptedData = EncryptionService.encrypt(JSON.stringify(userData));
          if (encryptedData) {
            localStorage.setItem("userInfo", encryptedData);
          }
        } catch (encryptionError) {
          console.error("Failed to encrypt user data:", encryptionError);
        }
      } else {
        console.warn("No user document found for UID:", uid);
        clearUserData();
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      clearUserData();
    } finally {
      setLoading(false);
    }
  };

  const clearUserData = () => {
    setUserInfo(null);
    setIsUserLoggedIn(false);
    localStorage.removeItem("userInfo");
  };

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      // Load persisted user data
      const loadPersistedUserData = () => {
        try {
          const encryptedData = localStorage.getItem("userInfo");
          if (encryptedData) {
            const decryptedData = EncryptionService.decrypt(encryptedData);
            if (decryptedData) {
              const parsedData = JSON.parse(decryptedData);
              setUserInfo(parsedData);
              setIsUserLoggedIn(true);
            }
          }
        } catch (error) {
          console.error("Error loading persisted user data:", error);
          clearUserData();
        }
      };

      loadPersistedUserData();

      // Avoid subscribing if Firebase auth isn't initialized
      if (!auth) {
        console.warn('Firebase auth not initialized; skipping auth listener.');
        setLoading(false);
        return;
      }

      // Set up authentication state listener
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user?.uid) {
          setIsUserLoggedIn(true);
          if (db) {
            await fetchUserData(user.uid);
          } else {
            console.warn('Firestore not initialized; cannot fetch user data.');
          }
        } else {
          clearUserData();
        }
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      userInfo,
      loading,
      isUserLoggedIn
    }),
    [userInfo, loading, isUserLoggedIn]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUserInfoContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserInfoProvider');
  }

  return context;
};
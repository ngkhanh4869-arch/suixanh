import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, db } from './config';
import { syncUserProfile, SUPER_ADMIN_EMAIL, FIRESTORE_COLLECTIONS } from './db';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export { SUPER_ADMIN_EMAIL };
export const ADMIN_EMAIL = SUPER_ADMIN_EMAIL;

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  isSuperAdmin: false,
  isLoading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserAdminStatus = async (user: User | null) => {
    if (!user || !user.email) {
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return;
    }

    const isSuper = user.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
    setIsSuperAdmin(isSuper);

    if (isSuper) {
      setIsAdmin(true);
      // Ensure super admin doc exists in /admins/{uid}
      try {
        const superAdminRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, user.uid);
        await setDoc(
          superAdminRef,
          {
            uid: user.uid,
            email: user.email.toLowerCase().trim(),
            displayName: user.displayName || 'Super Admin',
            role: 'superadmin',
            assignedBy: 'System Root',
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Super admin sync warning:', err);
      }
      return;
    }

    // Regular user: check if appointed in /admins/{uid}
    try {
      const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, user.uid);
      const snap = await getDoc(adminDocRef);
      setIsAdmin(snap.exists());
    } catch {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsLoading(true);

      if (user && user.email) {
        try {
          await syncUserProfile({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
        }
      }

      await checkUserAdminStatus(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.email) {
        try {
          await syncUserProfile({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
        } catch (err) {
          console.warn('Could not sync user profile to Firestore on login:', err);
        }
        await checkUserAdminStatus(result.user);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setIsAdmin(false);
      setIsSuperAdmin(false);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isSuperAdmin,
        isLoading,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

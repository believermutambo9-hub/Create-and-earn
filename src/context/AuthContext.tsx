import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, googleProvider, testFirestoreConnection } from '../firebase';
import { CreatorProfile, Role } from '../types';
import { INITIAL_CREATOR } from '../data/mockData';

// Default empty balances for newly created real accounts
export const DEFAULT_NEW_CREATOR: CreatorProfile = {
  id: '',
  name: 'New Creator',
  username: '@creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'African content creator & storyteller on CREATE & EARN.',
  category: 'Comedy',
  location: 'Lusaka, Zambia',
  countryFlag: '🇿🇲',
  followers: 0,
  following: 0,
  rating: 5.0,
  completedJobs: 0,
  totalEarnings: 0,
  availableBalance: 0,
  pendingBalance: 0,
  isVerified: false,
  role: 'creator',
  mobileMoneyNumber: '0979663914',
  mobileMoneyProvider: 'Airtel Money Zambia',
  services: [
    {
      id: 'srv-1',
      title: 'Sponsored Reel / TikTok Skit',
      rate: 'K450',
      description: 'Original funny comedy script featuring brand naturally with product placement.'
    }
  ],
  portfolioVideos: []
};

interface AuthContextType {
  firebaseUser: User | null;
  currentUserProfile: CreatorProfile;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (
    email: string, 
    pass: string, 
    name: string, 
    role: Role, 
    category: string, 
    location: string
  ) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfileData: (data: Partial<CreatorProfile>) => Promise<void>;
  adjustBalance: (deltaAvail: number, deltaPending: number, deltaTotal?: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  currentUserProfile: INITIAL_CREATOR,
  loading: true,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  logOut: async () => {},
  updateProfileData: async () => {},
  adjustBalance: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<CreatorProfile>(INITIAL_CREATOR);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    testFirestoreConnection();

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        
        // Listen in real-time to profile and balance changes in Firestore
        unsubscribeSnapshot = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUserProfile(docSnap.data() as CreatorProfile);
          } else {
            // First time login with Google: bootstrap profile with real K0.00 balances
            const newProfile: CreatorProfile = {
              ...DEFAULT_NEW_CREATOR,
              id: user.uid,
              name: user.displayName || 'Believer Creator',
              username: `@${(user.displayName || 'creator').toLowerCase().replace(/[^a-z0-9]/g, '')}`,
              email: user.email || '',
              avatar: user.photoURL || DEFAULT_NEW_CREATOR.avatar,
              bio: 'Zambian comedy creator & storyteller on CREATE & EARN.',
              availableBalance: 0,
              pendingBalance: 0,
              totalEarnings: 0,
              isVerified: false,
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUserProfile(newProfile);
          }
        }, (err) => {
          console.warn('Real-time profile listener warning:', err);
        });
      } else {
        // When not signed in, show clean preview profile
        setCurrentUserProfile(INITIAL_CREATOR);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (
        err?.code === 'auth/popup-closed-by-user' ||
        err?.code === 'auth/cancelled-popup-request'
      ) {
        // User closed the Google popup or dismissed it; gracefully return without error
        return;
      }
      console.warn('Google sign in note:', err?.message || err);
      throw err;
    }
  };

  const signUpWithEmail = async (
    email: string, 
    pass: string, 
    name: string, 
    role: Role, 
    category: string, 
    location: string
  ) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      
      const newProfile: CreatorProfile = {
        ...DEFAULT_NEW_CREATOR,
        id: cred.user.uid,
        name: name,
        email: email,
        username: `@${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'creator'}`,
        role: role,
        category: category || 'Comedy',
        location: location || 'Lusaka, Zambia',
        availableBalance: 0,
        pendingBalance: 0,
        totalEarnings: 0,
        isVerified: false,
      };

      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setCurrentUserProfile(newProfile);
    } catch (err: any) {
      console.error('Sign up error:', err);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Email sign in error:', err);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setCurrentUserProfile(INITIAL_CREATOR);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfileData = async (data: Partial<CreatorProfile>) => {
    const updated = { ...currentUserProfile, ...data };
    setCurrentUserProfile(updated);

    if (firebaseUser) {
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userDocRef, updated, { merge: true });
      } catch (err) {
        console.error('Failed to sync profile update to Firestore:', err);
      }
    }
  };

  const adjustBalance = async (deltaAvail: number, deltaPending: number, deltaTotal: number = 0) => {
    const newAvail = Math.max(0, currentUserProfile.availableBalance + deltaAvail);
    const newPending = Math.max(0, currentUserProfile.pendingBalance + deltaPending);
    const newTotal = (currentUserProfile.totalEarnings || 0) + deltaTotal;

    const updated = {
      ...currentUserProfile,
      availableBalance: newAvail,
      pendingBalance: newPending,
      totalEarnings: newTotal
    };

    setCurrentUserProfile(updated);

    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          availableBalance: newAvail,
          pendingBalance: newPending,
          totalEarnings: newTotal
        }, { merge: true });
      } catch (err) {
        console.error('Failed to update balance in Firestore:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUserProfile,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logOut,
        updateProfileData,
        adjustBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

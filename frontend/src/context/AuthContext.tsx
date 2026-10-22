import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  updateProfile,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  type User 
} from '../firebase/config';
import { UserProfile } from '../types/restaurant';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, pass: string, name: string, phone?: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  loginDemo: (role?: 'vip' | 'regular') => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (data: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  isFirebaseConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'saffron_restaurant_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Load from local storage as initial cache
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (cached) {
        setUserProfile(JSON.parse(cached));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveProfileLocally = (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  };

  const syncProfileFromFirestore = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        saveProfileLocally(data);
      } else {
        // Create initial doc
        const newProf: UserProfile = {
          uid: user.uid,
          email: user.email || 'guest@saffronandstone.com',
          displayName: user.displayName || user.email?.split('@')[0] || 'Gourmet Guest',
          loyaltyPoints: 120,
          favoriteDishIds: ['dish-1', 'dish-3'],
        };
        await setDoc(userRef, newProf);
        saveProfileLocally(newProf);
      }
      setIsFirebaseConnected(true);
    } catch (err: any) {
      console.warn('Firestore user fetch note:', err.message);
      // Fallback local profile if Firestore rules are restrictive
      const fallbackProf: UserProfile = {
        uid: user.uid,
        email: user.email || 'guest@saffronandstone.com',
        displayName: user.displayName || 'Gourmet Patron',
        loyaltyPoints: 120,
        favoriteDishIds: ['dish-1', 'dish-3'],
      };
      saveProfileLocally(fallbackProf);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncProfileFromFirestore(user);
      } else {
        // If not logged in, keep guest session or null
        const cached = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (cached) {
          try {
            setUserProfile(JSON.parse(cached));
          } catch {
            setUserProfile(null);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string, name: string, phone?: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(userCred.user, { displayName: name });
      
      const newProf: UserProfile = {
        uid: userCred.user.uid,
        email: email,
        displayName: name,
        phoneNumber: phone || '',
        loyaltyPoints: 150, // Welcome bonus points!
        favoriteDishIds: ['dish-1'],
        address: '124 Olive Tree Lane, Apt 4B'
      };
      
      try {
        await setDoc(doc(db, 'users', userCred.user.uid), newProf);
      } catch (err) {
        console.warn('Firestore rules warning:', err);
      }
      saveProfileLocally(newProf);
    } catch (err: any) {
      console.error('Signup error:', err);
      let msg = err.message || 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      await syncProfileFromFirestore(userCred.user);
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = err.message || 'Failed to sign in.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login for instant testing
  const loginDemo = async (role: 'vip' | 'regular' = 'vip') => {
    setError(null);
    const demoProfile: UserProfile = {
      uid: role === 'vip' ? 'vip-patron-889' : 'patron-402',
      email: role === 'vip' ? 'hamza.vip@saffronandstone.com' : 'foodie@saffronandstone.com',
      displayName: role === 'vip' ? 'Hamza Ali (VIP Member)' : 'Alex Rivera',
      phoneNumber: '+1 (555) 902-8321',
      address: '742 Evergreen Terrace, Suite 12',
      loyaltyPoints: role === 'vip' ? 840 : 220,
      favoriteDishIds: ['dish-1', 'dish-3', 'dish-9']
    };
    saveProfileLocally(demoProfile);
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // continue
    }
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const updateUserPreferences = async (data: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...data };
    saveProfileLocally(updated);
    if (currentUser) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), data);
      } catch (err) {
        console.warn('Update remote profile fallback:', err);
      }
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      error,
      signup,
      login,
      loginDemo,
      logout,
      updateUserPreferences,
      clearError,
      isFirebaseConnected
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MenuItem, 
  MenuCategory, 
  TableBooking, 
  Order, 
  OrderStatus, 
  RestaurantTable,
  TableZone
} from '../types/restaurant';
import { MENU_ITEMS, RESTAURANT_TABLES } from '../data/mockMenu';
import { 
  auth,
  db, 
  collection, 
  addDoc, 
  setDoc,
  serverTimestamp, 
  getDocs, 
  query, 
  where, 
  orderBy,
  updateDoc,
  doc,
  signInAnonymously
} from '../firebase/config';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface RestaurantContextType {
  // Menu & Filtering
  menuItems: MenuItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: MenuCategory;
  setSelectedCategory: (cat: MenuCategory) => void;
  onlyVegetarian: boolean;
  setOnlyVegetarian: (val: boolean) => void;
  onlyGlutenFree: boolean;
  setOnlyGlutenFree: (val: boolean) => void;
  onlyChefSpecials: boolean;
  setOnlyChefSpecials: (val: boolean) => void;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'prep_time';
  setSortBy: (sort: 'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'prep_time') => void;
  filteredMenuItems: MenuItem[];

  // Favorites
  favoriteIds: string[];
  toggleFavorite: (dishId: string) => void;

  // Selected Item Modal
  selectedItemForModal: MenuItem | null;
  setSelectedItemForModal: (item: MenuItem | null) => void;

  // Table Bookings
  tables: RestaurantTable[];
  bookings: TableBooking[];
  activeBooking: TableBooking | null;
  bookTable: (data: {
    guestCount: number;
    date: string;
    timeSlot: string;
    tableZone: TableZone;
    tableNumber: number;
    specialNotes?: string;
    occasion?: string;
    name: string;
    phone: string;
  }) => Promise<TableBooking>;
  cancelBooking: (bookingId: string) => Promise<void>;

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  placeOrder: (
    paymentMethod: 'gpay' | 'card' | 'cash',
    address: string | undefined,
    customerName: string,
    customerPhone: string
  ) => Promise<Order>;
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;
  cancelOrder: (orderId: string) => Promise<void>;

  // Sync state
  firebaseStatus: 'connected' | 'offline_fallback';
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const LOCAL_STORAGE_BOOKINGS_KEY = 'saffron_restaurant_bookings';
const LOCAL_STORAGE_ORDERS_KEY = 'saffron_restaurant_orders';
const LOCAL_STORAGE_FAVS_KEY = 'saffron_restaurant_favorites';

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile, currentUser, updateUserPreferences } = useAuth();
  const { 
    items: cartItems, 
    subtotal, 
    tax, 
    deliveryFee, 
    tipAmount, 
    discountAmount, 
    grandTotal, 
    orderType, 
    tableNumber,
    clearCart 
  } = useCart();

  // Menu Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [onlyVegetarian, setOnlyVegetarian] = useState(false);
  const [onlyGlutenFree, setOnlyGlutenFree] = useState(false);
  const [onlyChefSpecials, setOnlyChefSpecials] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating' | 'prep_time'>('recommended');
  
  // Modals & Detail
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Favorites
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_FAVS_KEY);
      return saved ? JSON.parse(saved) : ['dish-1', 'dish-3', 'dish-9'];
    } catch {
      return ['dish-1', 'dish-3', 'dish-9'];
    }
  });

  // Bookings & Orders
  const [tables] = useState<RestaurantTable[]>(RESTAURANT_TABLES);
  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'offline_fallback'>('connected');

  // Load from Firebase on user login
  useEffect(() => {
    const loadFirebaseData = async () => {
      if (!currentUser) return;
      try {
        // Query user orders from Firestore
        const ordersRef = collection(db, 'orders');
        const qOrders = query(ordersRef, where('userId', '==', currentUser.uid));
        const orderSnap = await getDocs(qOrders);
        if (!orderSnap.empty) {
          const loadedOrders: Order[] = [];
          orderSnap.forEach(d => {
            loadedOrders.push({ id: d.id, ...(d.data() as any) });
          });
          // Merge with local
          setOrders(prev => {
            const merged = [...loadedOrders];
            prev.forEach(p => {
              if (!merged.find(m => m.id === p.id)) merged.push(p);
            });
            return merged.sort((a, b) => b.createdAt - a.createdAt);
          });
        }

        // Query user bookings from Firestore
        const bookingsRef = collection(db, 'bookings');
        const qBookings = query(bookingsRef, where('userId', '==', currentUser.uid));
        const bookingSnap = await getDocs(qBookings);
        if (!bookingSnap.empty) {
          const loadedBookings: TableBooking[] = [];
          bookingSnap.forEach(d => {
            loadedBookings.push({ id: d.id, ...(d.data() as any) });
          });
          setBookings(prev => {
            const merged = [...loadedBookings];
            prev.forEach(p => {
              if (!merged.find(m => m.id === p.id)) merged.push(p);
            });
            return merged.sort((a, b) => b.createdAt - a.createdAt);
          });
        }
        setFirebaseStatus('connected');
      } catch (err: any) {
        console.warn('Firestore live read fallback:', err.message);
        setFirebaseStatus('offline_fallback');
      }
    };

    loadFirebaseData();
  }, [currentUser]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch {}
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_FAVS_KEY, JSON.stringify(favoriteIds));
    } catch {}
  }, [favoriteIds]);

  const toggleFavorite = (dishId: string) => {
    setFavoriteIds(prev => {
      const next = prev.includes(dishId) ? prev.filter(id => id !== dishId) : [...prev, dishId];
      if (userProfile) {
        updateUserPreferences({ favoriteDishIds: next });
      }
      return next;
    });
  };

  // Filter & Search Menu
  const filteredMenuItems = MENU_ITEMS.filter(item => {
    // Category match
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    // Search query match (name, description, tags, ingredients)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
      const matchIng = item.ingredients.some(i => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTag && !matchIng) {
        return false;
      }
    }

    // Dietary filters
    if (onlyVegetarian && !item.isVegetarian) return false;
    if (onlyGlutenFree && !item.isGlutenFree) return false;
    if (onlyChefSpecials && !item.isChefSpecial) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'prep_time') return a.prepTimeMinutes - b.prepTimeMinutes;
    // 'recommended'
    if (a.isChefSpecial && !b.isChefSpecial) return -1;
    if (!a.isChefSpecial && b.isChefSpecial) return 1;
    return b.rating - a.rating;
  });

  // Table Booking
  const bookTable = async (data: {
    guestCount: number;
    date: string;
    timeSlot: string;
    tableZone: TableZone;
    tableNumber: number;
    specialNotes?: string;
    occasion?: string;
    name: string;
    phone: string;
  }): Promise<TableBooking> => {
    const bookingId = `book-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newBooking: TableBooking = {
      id: bookingId,
      userId: currentUser?.uid || userProfile?.uid || 'guest-user',
      userEmail: currentUser?.email || userProfile?.email || 'guest@saffronandstone.com',
      userName: data.name || userProfile?.displayName || 'Gourmet Patron',
      userPhone: data.phone || userProfile?.phoneNumber || '+1 (555) 019-2831',
      guests: data.guestCount,
      date: data.date,
      timeSlot: data.timeSlot,
      tableZone: data.tableZone,
      tableNumber: data.tableNumber,
      specialNotes: data.specialNotes,
      occasion: data.occasion,
      status: 'confirmed',
      createdAt: Date.now(),
      syncedToFirebase: false
    };

    // Save locally first for snappy UI
    setBookings(prev => [newBooking, ...prev]);

    // Push to Firestore
    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...newBooking,
        firestoreTimestamp: serverTimestamp()
      });
      newBooking.syncedToFirebase = true;
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, id: docRef.id, syncedToFirebase: true } : b));
      setFirebaseStatus('connected');
    } catch (err: any) {
      console.warn('Firestore booking note:', err.message);
      setFirebaseStatus('offline_fallback');
    }

    return newBooking;
  };

  const cancelBooking = async (bookingId: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    try {
      const docRef = doc(db, 'bookings', bookingId);
      await updateDoc(docRef, { status: 'cancelled' });
    } catch {
      // fallback
    }
  };

  // Place Food Order
  const placeOrder = async (
    paymentMethod: 'gpay' | 'card' | 'cash',
    address: string | undefined,
    customerName: string,
    customerPhone: string
  ): Promise<Order> => {
    if (cartItems.length === 0) {
      throw new Error('Your cart is empty');
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      throw new Error('Please enter your name and phone number.');
    }

    if (orderType === 'delivery' && !address?.trim()) {
      throw new Error('Please enter a delivery address.');
    }

    let savedOrder: Order;
    try {
      const orderUser = currentUser || auth.currentUser || (await signInAnonymously(auth)).user;
      const orderRef = doc(collection(db, 'orders'));
      const orderItems = cartItems.map(({ item, selectedPortion, specialInstructions, ...cartItem }) => {
        const { portionOptions, addons, ...menuItem } = item;
        return {
          ...cartItem,
          item: {
            ...menuItem,
            ...(portionOptions ? { portionOptions } : {}),
            ...(addons ? { addons } : {})
          },
          ...(selectedPortion ? { selectedPortion } : {}),
          ...(specialInstructions ? { specialInstructions } : {})
        };
      });
      const newOrder: Order = {
        id: orderRef.id,
        userId: orderUser.uid,
        userEmail: orderUser.email || currentUser?.email || userProfile?.email || '',
        userName: customerName.trim(),
        userPhone: customerPhone.trim(),
        items: orderItems,
        subtotal,
        tax,
        deliveryFee,
        tip: tipAmount,
        discount: discountAmount,
        total: grandTotal,
        status: 'pending',
        orderType,
        ...(orderType === 'delivery' ? { deliveryAddress: address!.trim() } : {}),
        ...(orderType === 'dine_in' ? { tableNumber: tableNumber || 4 } : {}),
        paymentMethod,
        paymentStatus: 'pending',
        estimatedMinutes: orderType === 'delivery' ? 30 : 20,
        createdAt: Date.now(),
        syncedToFirebase: false
      };

      await setDoc(orderRef, {
        ...newOrder,
        syncedToFirebase: true,
        firestoreTimestamp: serverTimestamp()
      });
      savedOrder = { ...newOrder, syncedToFirebase: true };
      setFirebaseStatus('connected');
    } catch (error) {
      console.error('Failed to save order to Firestore:', error);
      setFirebaseStatus('offline_fallback');

      const errorCode = typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;
      if (errorCode === 'auth/operation-not-allowed') {
        throw new Error('Guest checkout is not enabled for this Firebase project. Please sign in or enable Anonymous authentication.');
      }
      if (errorCode === 'permission-denied') {
        throw new Error('Firebase did not authorize this order. Please sign in again or contact the restaurant.');
      }
      throw new Error('We could not save your order. Check your connection and try again. Your cart has been kept.');
    }

    setOrders(prev => [savedOrder, ...prev]);
    setTrackingOrder(savedOrder);
    clearCart();

    if (userProfile) {
      const earned = Math.floor(grandTotal);
      updateUserPreferences({ loyaltyPoints: (userProfile.loyaltyPoints || 0) + earned });
    }

    return savedOrder;
  };

  const cancelOrder = async (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    if (trackingOrder?.id === orderId) {
      setTrackingOrder(prev => prev ? { ...prev, status: 'cancelled' } : null);
    }
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'cancelled' });
    } catch {
      // fallback
    }
  };

  // Find active ongoing order and active booking
  const activeOrder = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled') || null;
  const activeBooking = bookings.find(b => b.status === 'confirmed' || b.status === 'seated') || null;

  return (
    <RestaurantContext.Provider value={{
      menuItems: MENU_ITEMS,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      onlyVegetarian,
      setOnlyVegetarian,
      onlyGlutenFree,
      setOnlyGlutenFree,
      onlyChefSpecials,
      setOnlyChefSpecials,
      sortBy,
      setSortBy,
      filteredMenuItems,
      favoriteIds,
      toggleFavorite,
      selectedItemForModal,
      setSelectedItemForModal,
      tables,
      bookings,
      activeBooking,
      bookTable,
      cancelBooking,
      orders,
      activeOrder,
      placeOrder,
      trackingOrder,
      setTrackingOrder,
      cancelOrder,
      firebaseStatus
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

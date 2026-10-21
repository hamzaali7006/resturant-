import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, PortionOption, AddonOption, OrderType } from '../types/restaurant';
import { RESTAURANT_INFO, POPULAR_PROMOS } from '../data/mockMenu';

interface AppliedPromo {
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  description: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    item: MenuItem, 
    quantity?: number, 
    portion?: PortionOption, 
    addons?: AddonOption[], 
    specialNotes?: string
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tipPercent: number;
  setTipPercent: (percent: number) => void;
  customTip: number;
  setCustomTip: (tip: number) => void;
  tableNumber: number | null;
  setTableNumber: (table: number | null) => void;
  promoCode: string;
  appliedPromo: AppliedPromo | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tipAmount: number;
  discountAmount: number;
  grandTotal: number;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = 'saffron_restaurant_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState<number>(0);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [promoCode, setPromoCode] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addToCart = (
    item: MenuItem, 
    quantity = 1, 
    portion?: PortionOption, 
    addons: AddonOption[] = [], 
    specialNotes?: string
  ) => {
    // calculate unit price
    const basePrice = item.price;
    const portionPrice = portion ? portion.priceDelta : 0;
    const addonsPrice = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + portionPrice + addonsPrice;

    // Check if an identical custom configuration already exists
    const addonNamesSorted = addons.map(a => a.name).sort().join('|');
    const existingIndex = items.findIndex(i => 
      i.item.id === item.id && 
      i.selectedPortion?.id === portion?.id &&
      i.selectedAddons.map(a => a.name).sort().join('|') === addonNamesSorted &&
      (i.specialInstructions || '') === (specialNotes || '')
    );

    if (existingIndex > -1) {
      // Increment quantity
      setItems(prev => {
        const copy = [...prev];
        const existing = copy[existingIndex];
        const newQty = existing.quantity + quantity;
        copy[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: unitPrice * newQty
        };
        return copy;
      });
    } else {
      // Add new cart item
      const newItem: CartItem = {
        cartItemId: `${item.id}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        item,
        quantity,
        selectedPortion: portion,
        selectedAddons: addons,
        specialInstructions: specialNotes,
        unitPrice,
        totalPrice: unitPrice * quantity
      };
      setItems(prev => [newItem, ...prev]);
    }
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: item.unitPrice * newQty
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
    setPromoCode('');
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = POPULAR_PROMOS.find(p => p.code === cleanCode);
    if (!found) {
      return { success: false, message: 'Invalid promo code. Try "GOURMET20" or "BISTRO10"' };
    }
    setPromoCode(cleanCode);
    setAppliedPromo(found);
    return { success: true, message: `Code "${cleanCode}" applied! ${found.description}` };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setAppliedPromo(null);
  };

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = Number((subtotal * 0.0825).toFixed(2)); // 8.25% restaurant tax
  
  // Delivery fee logic
  let deliveryFee = 0;
  if (orderType === 'delivery') {
    deliveryFee = subtotal >= RESTAURANT_INFO.freeDeliveryThreshold || subtotal === 0 ? 0 : RESTAURANT_INFO.deliveryFee;
  }

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountPercent) {
      discountAmount = Number(((subtotal * appliedPromo.discountPercent) / 100).toFixed(2));
    } else if (appliedPromo.discountAmount) {
      discountAmount = Math.min(subtotal, appliedPromo.discountAmount);
    }
  }

  // Tip calculation
  const tipAmount = customTip > 0 ? customTip : Number(((subtotal * tipPercent) / 100).toFixed(2));

  // Grand total
  const grandTotal = Math.max(0, Number((subtotal - discountAmount + tax + deliveryFee + tipAmount).toFixed(2)));
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      orderType,
      setOrderType,
      tipPercent,
      setTipPercent,
      customTip,
      setCustomTip,
      tableNumber,
      setTableNumber,
      promoCode,
      appliedPromo,
      applyPromoCode,
      removePromoCode,
      subtotal,
      tax,
      deliveryFee,
      tipAmount,
      discountAmount,
      grandTotal,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

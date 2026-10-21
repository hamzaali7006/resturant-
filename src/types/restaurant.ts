export type MenuCategory = 
  | 'all'
  | 'starters'
  | 'mains'
  | 'steaks'
  | 'pizza_pasta'
  | 'desserts'
  | 'beverages'
  | 'chef_specials';

export interface PortionOption {
  id: string;
  name: string;
  priceDelta: number;
}

export interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  rating: number;
  reviewsCount: number;
  prepTimeMinutes: number;
  calories: number;
  spicyLevel: 0 | 1 | 2 | 3; // 0=mild, 1=warm, 2=medium, 3=fiery
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isChefSpecial: boolean;
  image: string;
  tags: string[];
  ingredients: string[];
  portionOptions?: PortionOption[];
  addons?: AddonOption[];
}

export interface CartItem {
  cartItemId: string;
  item: MenuItem;
  quantity: number;
  selectedPortion?: PortionOption;
  selectedAddons: AddonOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
export type OrderType = 'delivery' | 'pickup' | 'dine_in';
export type PaymentMethod = 'gpay' | 'card' | 'cash';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  discount: number;
  total: number;
  status: OrderStatus;
  orderType: OrderType;
  deliveryAddress?: string;
  tableNumber?: number;
  paymentMethod: PaymentMethod;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  estimatedMinutes: number;
  createdAt: number;
  syncedToFirebase?: boolean;
}

export type TableZone = 'main_hall' | 'patio_garden' | 'rooftop_terrace' | 'chefs_counter' | 'vip_booth';

export interface RestaurantTable {
  id: number;
  number: number;
  zone: TableZone;
  capacity: number;
  isAvailable: boolean;
  label: string;
}

export interface TableBooking {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  guests: number;
  date: string;
  timeSlot: string;
  tableZone: TableZone;
  tableNumber: number;
  specialNotes?: string;
  occasion?: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled';
  createdAt: number;
  syncedToFirebase?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  address?: string;
  loyaltyPoints: number;
  favoriteDishIds: string[];
}

export type AppTab = 'home' | 'menu' | 'booking' | 'cart' | 'profile';

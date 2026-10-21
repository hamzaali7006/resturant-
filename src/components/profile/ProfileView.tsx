import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  ShoppingBag, 
  CalendarDays, 
  Heart, 
  LogOut, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  Phone, 
  MapPin, 
  ChevronRight,
  RotateCcw,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { AuthModal } from '../auth/AuthModal';

interface ProfileViewProps {
  onNavigateToMenu: () => void;
  onOpenOrderTracker: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateToMenu, onOpenOrderTracker }) => {
  const { userProfile, currentUser, logout, loginDemo } = useAuth();
  const { orders, bookings, favoriteIds, menuItems, setTrackingOrder, cancelOrder } = useRestaurant();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'favorites' | 'firebase'>('orders');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const favItems = menuItems.filter(m => favoriteIds.includes(m.id));

  return (
    <div className="p-4 space-y-5 pb-24 text-stone-100">
      {/* Profile Header */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-black text-xl flex items-center justify-center shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/40">
              {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'H'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-amber-50">
                  {userProfile?.displayName || 'Hamza Ali (Patron)'}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-0.5">
                  <Crown className="w-2.5 h-2.5" /> VIP
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">{userProfile?.email || 'hamzaalibutt70@gmail.com'}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-amber-400" /> {userProfile?.phoneNumber || '+1 (555) 723-3766'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 items-end">
            {currentUser || userProfile ? (
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-red-400 border border-stone-700/80 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Loyalty Rewards Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-stone-950/70 border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Saffron Gourmet Rewards
            </div>
            <div className="text-lg font-serif font-black text-amber-100 mt-0.5">
              {userProfile?.loyaltyPoints || 840} Points
            </div>
            <div className="text-[10px] text-stone-400">Tier: Platinum Connoisseur (Free Truffle Upgrade)</div>
          </div>

          <div className="text-right">
            <span className="px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
              10 pts = $1 off
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="p-1 bg-stone-900 border border-stone-800 rounded-2xl grid grid-cols-4 gap-1 text-xs text-center">
        {[
          { id: 'orders' as const, label: 'Orders', icon: <ShoppingBag className="w-3.5 h-3.5" />, count: orders.length },
          { id: 'bookings' as const, label: 'Tables', icon: <CalendarDays className="w-3.5 h-3.5" />, count: bookings.length },
          { id: 'favorites' as const, label: 'Favorites', icon: <Heart className="w-3.5 h-3.5" />, count: favItems.length },
          { id: 'firebase' as const, label: 'Firebase', icon: <Database className="w-3.5 h-3.5" /> },
        ].map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className="flex items-center gap-1">
                {tab.icon}
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className="text-[10px] opacity-80">({tab.count})</span>
                )}
              </div>
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/60 rounded-2xl border border-stone-800 text-stone-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-stone-600" />
              <p className="text-xs">No orders placed yet.</p>
              <button
                onClick={onNavigateToMenu}
                className="text-xs text-amber-400 underline font-semibold"
              >
                Order from our menu
              </button>
            </div>
          ) : (
            orders.map((ord) => (
              <div 
                key={ord.id}
                className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-amber-400 font-bold">#{ord.id}</span>
                    <span className="text-stone-400 text-[10px] block mt-0.5">
                      {new Date(ord.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : ord.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    }`}>
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-1 text-[11px] text-stone-300 border-y border-stone-800/80 py-2">
                  {ord.items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between">
                      <span>{it.quantity}x {it.item.name}</span>
                      <span className="font-mono text-stone-400">${it.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="font-mono text-stone-100 font-bold">
                    Total: <span className="text-amber-400 font-black">${ord.total.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2">
                    {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          setTrackingOrder(ord);
                          onOpenOrderTracker();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md flex items-center gap-1"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        ord.items.forEach(i => addToCart(i.item, i.quantity, i.selectedPortion, i.selectedAddons));
                        alert('Items re-added to your cart!');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-order</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Bookings History */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/60 rounded-2xl border border-stone-800 text-stone-400 space-y-2">
              <CalendarDays className="w-8 h-8 mx-auto text-stone-600" />
              <p className="text-xs">No active table reservations.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div 
                key={b.id}
                className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-2 text-xs shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">Table #{b.tableNumber}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-stone-800 text-stone-500'
                  }`}>
                    {b.status}
                  </span>
                </div>
                <div className="text-stone-300">
                  {b.date} at {b.timeSlot} • {b.guests} Guests
                </div>
                <div className="text-[11px] text-stone-400 capitalize">
                  Zone: {b.tableZone.replace('_', ' ')} {b.occasion ? `• ${b.occasion}` : ''}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Favorite Dishes */}
      {activeTab === 'favorites' && (
        <div className="space-y-3">
          {favItems.length === 0 ? (
            <div className="p-8 text-center bg-stone-900/60 rounded-2xl border border-stone-800 text-stone-400 space-y-2">
              <Heart className="w-8 h-8 mx-auto text-stone-600" />
              <p className="text-xs">No favorite dishes added yet.</p>
              <button onClick={onNavigateToMenu} className="text-xs text-amber-400 underline font-semibold">
                Explore dishes & tap heart
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {favItems.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 bg-stone-900/90 rounded-2xl border border-stone-800 flex items-center justify-between gap-3 shadow-md"
                >
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-bold text-amber-100 truncate">{item.name}</h4>
                    <span className="font-mono text-xs font-bold text-amber-400">${item.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(item, 1);
                      alert(`Added ${item.name} to cart!`);
                    }}
                    className="px-2.5 py-1.5 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold hover:bg-amber-400"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Firebase Integration Details */}
      {activeTab === 'firebase' && (
        <div className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-stone-800 pb-2">
            <Database className="w-4 h-4" />
            <span>Firebase Cloud Integration Configuration</span>
          </div>

          <div className="space-y-2 font-mono text-[11px] text-stone-300">
            <div className="flex justify-between bg-stone-950 p-2 rounded-lg border border-stone-800">
              <span className="text-stone-500">Project ID:</span>
              <span className="text-amber-400">myresturent-36f45</span>
            </div>
            <div className="flex justify-between bg-stone-950 p-2 rounded-lg border border-stone-800">
              <span className="text-stone-500">Auth Domain:</span>
              <span className="text-stone-200">myresturent-36f45.firebaseapp.com</span>
            </div>
            <div className="flex justify-between bg-stone-950 p-2 rounded-lg border border-stone-800">
              <span className="text-stone-500">Collections:</span>
              <span className="text-emerald-400">orders, bookings, users</span>
            </div>
            <div className="flex justify-between bg-stone-950 p-2 rounded-lg border border-stone-800">
              <span className="text-stone-500">SDK Status:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5" /> Initialized & Active
              </span>
            </div>
          </div>

          <p className="text-[11px] text-stone-400 leading-relaxed pt-1">
            All user orders, table reservations, and authentication credentials sync with your remote Firebase Firestore instance and local caching engine.
          </p>
        </div>
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bike, 
  CalendarDays, 
  Flame, 
  Clock, 
  Star, 
  ArrowRight, 
  Heart, 
  Crown,
  ChefHat,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { RESTAURANT_INFO } from '../../data/mockMenu';
import { AppTab, MenuItem } from '../../types/restaurant';

interface HomeViewProps {
  onNavigateTab: (tab: AppTab) => void;
  onOpenItemModal: (item: MenuItem) => void;
  onOpenOrderTracker: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigateTab, 
  onOpenItemModal, 
  onOpenOrderTracker 
}) => {
  const { userProfile } = useAuth();
  const { 
    menuItems, 
    activeOrder, 
    activeBooking, 
    favoriteIds, 
    toggleFavorite,
    setSelectedCategory,
    setOnlyChefSpecials
  } = useRestaurant();
  const { addToCart } = useCart();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroBanners = [
    {
      title: "Woodfire Autumn Tasting",
      subtitle: "20% off gourmet takeout & dine-in",
      code: "Use code GOURMET20",
      cta: "Explore Specials",
      badge: "Seasonal Harvest",
      bgImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Rooftop Starlight Dining",
      subtitle: "Sunset skyline views with live jazz",
      code: "Table booking open",
      cta: "Reserve a Table",
      badge: "Atmosphere",
      bgImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const chefSpecials = menuItems.filter(m => m.isChefSpecial).slice(0, 4);
  const bestSellers = menuItems.filter(m => m.rating >= 4.8).slice(0, 4);

  return (
    <div className="space-y-6 pb-24 text-stone-100">
      {/* Top Greeting & Header Bar */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-amber-400 font-semibold tracking-wide uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Welcome to Saffron & Stone
          </span>
          <h1 className="font-serif text-xl font-bold text-amber-50 mt-0.5">
            {userProfile?.displayName ? `Hello, ${userProfile.displayName.split(' ')[0]}` : 'Good Evening, Guest'}
          </h1>
        </div>

        {/* Loyalty Points Pill */}
        <button 
          onClick={() => onNavigateTab('profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 border border-amber-500/30 text-xs shadow-md hover:border-amber-500 transition-colors"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono font-bold text-amber-300">{userProfile?.loyaltyPoints || 840}</span>
          <span className="text-[10px] text-stone-400">pts</span>
        </button>
      </div>

      {/* Quick Search Tap Trigger */}
      <div className="px-4">
        <button
          onClick={() => onNavigateTab('menu')}
          className="w-full flex items-center justify-between px-4 py-3 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-stone-400 hover:border-amber-500/50 shadow-inner group transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-stone-400 group-hover:text-amber-400 transition-colors" />
            <span>Search dishes, steaks, pasta, drinks...</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-400 group-hover:text-stone-200">
            Menu
          </span>
        </button>
      </div>

      {/* Active Ongoing Order Tracker Card (if user has active order) */}
      {activeOrder && (
        <div className="px-4">
          <div 
            onClick={onOpenOrderTracker}
            className="p-3.5 bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-500/50 rounded-2xl flex items-center justify-between shadow-xl cursor-pointer hover:border-amber-400 transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30 animate-pulse">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-200">Order #{activeOrder.id}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                <p className="text-[11px] text-stone-300">
                  {activeOrder.status === 'preparing' ? 'Woodfire kitchen is searing your meal' : 'Live delivery tracking in progress'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
              <span>Track</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Active Table Reservation Card (if exists) */}
      {activeBooking && (
        <div className="px-4">
          <div 
            onClick={() => onNavigateTab('booking')}
            className="p-3 bg-stone-900/90 border border-emerald-500/30 rounded-2xl flex items-center justify-between shadow-md cursor-pointer hover:border-emerald-500/60 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <span className="font-bold text-stone-200">Table #{activeBooking.tableNumber} Confirmed</span>
                <span className="text-stone-400 text-[10px] block">{activeBooking.date} at {activeBooking.timeSlot} • {activeBooking.guests} Guests</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
              View Pass
            </span>
          </div>
        </div>
      )}

      {/* Hero Carousel Banner */}
      <div className="px-4">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
          <img 
            src={heroBanners[activeSlide].bgImage} 
            alt="Hero Bistro" 
            className="w-full h-full object-cover brightness-75 scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col justify-end">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-black/60 px-2 py-0.5 rounded-md w-max border border-amber-500/30">
              {heroBanners[activeSlide].badge}
            </span>
            <h2 className="font-serif text-xl font-bold text-white mt-1">
              {heroBanners[activeSlide].title}
            </h2>
            <p className="text-xs text-stone-300 mt-0.5">
              {heroBanners[activeSlide].subtitle}
            </p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/40">
                {heroBanners[activeSlide].code}
              </span>

              <button
                onClick={() => {
                  if (activeSlide === 0) onNavigateTab('menu');
                  else onNavigateTab('booking');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg flex items-center gap-1 active:scale-95 transition-transform"
              >
                <span>{heroBanners[activeSlide].cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute top-3 right-3 flex gap-1">
            {heroBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${activeSlide === idx ? 'w-5 bg-amber-400' : 'bg-stone-500/70'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="px-4">
        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setOnlyChefSpecials(false);
              onNavigateTab('menu');
            }}
            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 flex flex-col items-center text-center shadow-lg group transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Bike className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-100">Order Food</span>
            <span className="text-[10px] text-stone-400 mt-0.5">25-35 mins</span>
          </button>

          <button
            onClick={() => onNavigateTab('booking')}
            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 flex flex-col items-center text-center shadow-lg group transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-100">Book Table</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Floor Plan Map</span>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('all');
              setOnlyChefSpecials(true);
              onNavigateTab('menu');
            }}
            className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-amber-500/40 flex flex-col items-center text-center shadow-lg group transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <span className="text-xs font-bold text-amber-100">Chef Specials</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Signature Dishes</span>
          </button>
        </div>
      </div>

      {/* Chef's Signature Tasting Showcase (Horizontal Scroll) */}
      <div className="space-y-3">
        <div className="px-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-amber-50 flex items-center gap-1.5">
              <span>Chef's Signature Creations</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h2>
            <p className="text-[11px] text-stone-400">Handcrafted daily with prime seasonal ingredients</p>
          </div>
          <button
            onClick={() => {
              setOnlyChefSpecials(true);
              onNavigateTab('menu');
            }}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            See all
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-4 pb-2">
          {chefSpecials.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItemModal(item)}
              className="w-56 flex-shrink-0 bg-stone-900/90 rounded-2xl border border-stone-800 overflow-hidden shadow-lg cursor-pointer hover:border-amber-500/40 transition-all group"
            >
              <div className="relative h-32 w-full bg-stone-950 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-stone-950/80 px-2 py-0.5 rounded-full border border-stone-700 text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating}</span>
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-serif text-xs font-bold text-amber-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">{item.description}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800">
                  <span className="font-mono text-xs font-bold text-amber-400">${item.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenItemModal(item);
                    }}
                    className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] font-bold hover:bg-amber-500 hover:text-stone-950 transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Delicacies Grid */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-amber-50">Patron Favorites</h2>
            <p className="text-[11px] text-stone-400">Most loved dishes at Saffron & Stone</p>
          </div>
          <button
            onClick={() => onNavigateTab('menu')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            Full Menu
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {bestSellers.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenItemModal(item)}
              className="bg-stone-900/90 rounded-2xl border border-stone-800 overflow-hidden shadow-md cursor-pointer hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full bg-stone-950">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-stone-950/70 flex items-center justify-center border border-stone-700/60"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      favoriteIds.includes(item.id) ? 'fill-red-500 text-red-500' : 'text-stone-300'
                    }`}
                  />
                </button>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xs font-bold text-amber-100 line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                    <span>•</span>
                    <span>{item.prepTimeMinutes}m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800">
                  <span className="font-mono text-xs font-bold text-amber-400">${item.price.toFixed(2)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 font-semibold">
                    Order
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant Bistro Information Card */}
      <div className="px-4">
        <div className="p-4 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-amber-200">{RESTAURANT_INFO.name}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5.0 (1.4k Reviews)</span>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            {RESTAURANT_INFO.address} • {RESTAURANT_INFO.openingHours}
          </p>
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-300">
            <span>Free delivery over ${RESTAURANT_INFO.freeDeliveryThreshold}</span>
            <span className="text-amber-400 font-bold">Average prep: {RESTAURANT_INFO.deliveryTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

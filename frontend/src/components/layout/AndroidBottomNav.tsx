import React from 'react';
import { Home, Utensils, CalendarDays, ShoppingBag, User } from 'lucide-react';
import { AppTab } from '../../types/restaurant';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

interface AndroidBottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { totalItemCount, grandTotal } = useCart();
  const { activeBooking } = useRestaurant();

  const tabs: { id: AppTab; label: string; icon: React.ReactNode; badge?: number | boolean }[] = [
    {
      id: 'home',
      label: 'Discover',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'menu',
      label: 'Artisan Menu',
      icon: <Utensils className="w-5 h-5" />,
    },
    {
      id: 'booking',
      label: 'Reserve Table',
      icon: <CalendarDays className="w-5 h-5" />,
      badge: activeBooking ? true : false,
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: <ShoppingBag className="w-5 h-5" />,
      badge: totalItemCount > 0 ? totalItemCount : undefined,
    },
    {
      id: 'profile',
      label: 'Account',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/80 px-2 pt-1.5 pb-2 text-stone-400">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 relative transition-all duration-200 group ${
                isActive ? 'text-amber-400 font-semibold scale-105' : 'hover:text-stone-200'
              }`}
            >
              <div className="relative p-1">
                {tab.icon}
                {/* Number Badge (Cart) */}
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                    {tab.badge}
                  </span>
                )}
                {/* Dot Badge (Active reservation) */}
                {tab.badge === true && (
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-stone-950 animate-ping"></span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 line-clamp-1">{tab.label}</span>
              {isActive && (
                <div className="w-6 h-0.5 bg-amber-400 rounded-full mt-0.5 shadow-sm shadow-amber-400"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Android Gestural Navigation Bar Line */}
      <div className="w-32 h-1 bg-stone-600/70 rounded-full mx-auto mt-1.5"></div>
    </nav>
  );
};

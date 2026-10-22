import React from 'react';
import { MenuFilters } from './MenuFilters';
import { MenuCard } from './MenuCard';
import { MenuItem } from '../../types/restaurant';
import { useRestaurant } from '../../context/RestaurantContext';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowRight, UtensilsCrossed } from 'lucide-react';

interface MenuViewProps {
  onSelectItem: (item: MenuItem) => void;
  onNavigateToCart: () => void;
}

export const MenuView: React.FC<MenuViewProps> = ({ onSelectItem, onNavigateToCart }) => {
  const { filteredMenuItems, searchQuery, selectedCategory } = useRestaurant();
  const { totalItemCount, grandTotal } = useCart();

  return (
    <div className="space-y-4 pb-28 text-stone-100">
      {/* Filters (Search, Category Pills, Dietary Chips, Sort) */}
      <MenuFilters />

      {/* Menu Cards Grid */}
      <div className="px-4">
        {filteredMenuItems.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-stone-900/40 rounded-3xl border border-stone-800/80 p-6">
            <UtensilsCrossed className="w-12 h-12 mx-auto text-stone-600" />
            <h3 className="font-serif text-lg font-bold text-amber-200">No Delicacies Found</h3>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              We couldn't find any dishes matching "{searchQuery}". Try searching for pasta, steak, salmon, or resetting your dietary filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMenuItems.map((item) => (
              <MenuCard 
                key={item.id} 
                item={item} 
                onSelect={onSelectItem} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Bar (if items in cart) */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-40 animate-slide-up">
          <button
            onClick={onNavigateToCart}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs shadow-2xl shadow-amber-500/40 flex items-center justify-between border border-amber-400/50 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center font-black">
                {totalItemCount}
              </div>
              <div className="text-left">
                <div className="font-black text-sm text-stone-950">View Your Order</div>
                <div className="text-[10px] text-stone-900/80">Ready for checkout</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-sm font-black">
              <span>${grandTotal.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

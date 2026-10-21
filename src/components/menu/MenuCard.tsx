import React from 'react';
import { Star, Heart, Plus, Sparkles, Clock } from 'lucide-react';
import { MenuItem } from '../../types/restaurant';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

interface MenuCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, onSelect }) => {
  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useRestaurant();
  const isFav = favoriteIds.includes(item.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.portionOptions && item.portionOptions.length > 0) {
      // If portion options exist, open customizer modal
      onSelect(item);
    } else {
      addToCart(item, 1);
    }
  };

  return (
    <div 
      onClick={() => onSelect(item)}
      className="group bg-stone-900/90 rounded-2xl border border-stone-800/80 overflow-hidden shadow-lg hover:border-amber-500/40 hover:shadow-amber-500/10 transition-all duration-300 flex flex-col cursor-pointer active:scale-[0.99]"
    >
      {/* Dish Image Banner */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-950">
        <img 
          src={item.image} 
          alt={item.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/40"></div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-stone-950/70 backdrop-blur-md flex items-center justify-center border border-stone-700/60 active:scale-90 transition-transform"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFav ? 'fill-red-500 text-red-500' : 'text-stone-300 hover:text-white'
            }`} 
          />
        </button>

        {/* Rating and Chef Special Badge */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-stone-950/85 backdrop-blur-md px-2 py-0.5 rounded-full border border-stone-800 text-[11px] font-semibold text-amber-300">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating}</span>
          </div>

          {item.isChefSpecial && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center gap-1 shadow-md">
              <Sparkles className="w-2.5 h-2.5" /> Chef Special
            </span>
          )}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-serif text-sm font-bold text-amber-100 group-hover:text-amber-400 transition-colors line-clamp-1">
              {item.name}
            </h3>
          </div>

          <p className="text-[12px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Micro Tags (Veg, Spicy, Prep) */}
          <div className="flex items-center gap-2 mt-2 text-[10px] text-stone-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-500" />
              {item.prepTimeMinutes}m
            </span>
            {item.isVegetarian && (
              <span className="text-emerald-400 font-medium">🌱 Veg</span>
            )}
            {item.isGlutenFree && (
              <span className="text-sky-400 font-medium">🌾 GF</span>
            )}
            {item.spicyLevel > 0 && (
              <span className="text-orange-400">
                {'🌶️'.repeat(item.spicyLevel)}
              </span>
            )}
          </div>
        </div>

        {/* Price & Quick Add Button */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-800/80">
          <span className="font-mono text-base font-bold text-amber-400">
            ${item.price.toFixed(2)}
          </span>

          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

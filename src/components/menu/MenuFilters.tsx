import React from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MenuCategory } from '../../types/restaurant';
import { useRestaurant } from '../../context/RestaurantContext';

export const MenuFilters: React.FC = () => {
  const {
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
    filteredMenuItems
  } = useRestaurant();

  const categories: { id: MenuCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Menu', icon: '🍽️' },
    { id: 'chef_specials', label: "Chef's Choice", icon: '✨' },
    { id: 'starters', label: 'Starters', icon: '🥗' },
    { id: 'steaks', label: 'Steaks & Grills', icon: '🥩' },
    { id: 'pizza_pasta', label: 'Pizza & Pasta', icon: '🍕' },
    { id: 'mains', label: 'Mains', icon: '🍲' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'beverages', label: 'Bar & Drinks', icon: '🍸' },
  ];

  return (
    <div className="space-y-3 px-4 py-2">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search truffle, salmon, burrata, cocktails..."
          className="w-full pl-10 pr-9 py-2.5 bg-stone-900 border border-stone-800 rounded-2xl text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Horizontal Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 scale-102'
                  : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dietary and Sort Bar */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-800/60 text-xs">
        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setOnlyChefSpecials(!onlyChefSpecials)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              onlyChefSpecials
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Chef's Choice</span>
          </button>

          <button
            onClick={() => setOnlyVegetarian(!onlyVegetarian)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              onlyVegetarian
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <span>🌱</span>
            <span>Veg</span>
          </button>

          <button
            onClick={() => setOnlyGlutenFree(!onlyGlutenFree)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
              onlyGlutenFree
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-stone-900/60 text-stone-400 border-stone-800'
            }`}
          >
            <span>🌾</span>
            <span>GF</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <SlidersHorizontal className="w-3 h-3 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stone-900 text-stone-300 border border-stone-800 rounded-lg text-[11px] px-2 py-1 focus:outline-none focus:border-amber-500"
          >
            <option value="recommended">Featured</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="prep_time">Fastest Prep</option>
          </select>
        </div>
      </div>

      {/* Filter result status count */}
      {(searchQuery || selectedCategory !== 'all' || onlyVegetarian || onlyGlutenFree || onlyChefSpecials) && (
        <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
          <span>Found <strong className="text-amber-400">{filteredMenuItems.length}</strong> delicacies</span>
          {(searchQuery || onlyVegetarian || onlyGlutenFree || onlyChefSpecials) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setOnlyVegetarian(false);
                setOnlyGlutenFree(false);
                setOnlyChefSpecials(false);
              }}
              className="text-amber-400/90 underline hover:text-amber-300"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

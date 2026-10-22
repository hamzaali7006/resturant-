import React, { useState } from 'react';
import { X, Heart, Star, Clock, Flame, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { MenuItem, PortionOption, AddonOption } from '../../types/restaurant';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';

interface FoodDetailModalProps {
  item: MenuItem;
  onClose: () => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const { favoriteIds, toggleFavorite } = useRestaurant();

  const isFavorite = favoriteIds.includes(item.id);
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<PortionOption | undefined>(
    item.portionOptions && item.portionOptions.length > 0 ? item.portionOptions[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const toggleAddon = (addon: AddonOption) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(prev => prev.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons(prev => [...prev, addon]);
    }
  };

  // Calculate current unit price
  const basePrice = item.price;
  const portionPrice = selectedPortion ? selectedPortion.priceDelta : 0;
  const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + portionPrice + addonsPrice;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, quantity, selectedPortion, selectedAddons, specialInstructions);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner with Floating Controls */}
        <div className="relative h-60 w-full bg-stone-950 flex-shrink-0">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover brightness-95" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-black/60"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-stone-900/80 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center border border-stone-700/60 shadow-lg active:scale-95 transition-transform"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Favorite Toggle */}
          <button
            onClick={() => toggleFavorite(item.id)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-900/80 backdrop-blur-md flex items-center justify-center border border-stone-700/60 shadow-lg active:scale-95 transition-transform"
          >
            <Heart 
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-300 hover:text-white'
              }`} 
            />
          </button>

          {/* Badge Chips Over Image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {item.isChefSpecial && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> Chef Special
                </span>
              )}
              {item.isVegetarian && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold">
                  🌱 Vegetarian
                </span>
              )}
              {item.isGlutenFree && (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[11px] font-semibold">
                  🌾 Gluten-Free
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-700 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-300">{item.rating}</span>
              <span className="text-stone-400 text-[10px]">({item.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 no-scrollbar">
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-bold text-amber-50">{item.name}</h2>
              <span className="text-2xl font-black text-amber-400 font-mono">${item.price.toFixed(2)}</span>
            </div>
            <p className="text-sm text-stone-300 mt-2 leading-relaxed">{item.description}</p>
          </div>

          {/* Quick Info bar: Calories, Prep Time, Spicy */}
          <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-stone-950/60 rounded-2xl border border-stone-800 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-stone-400 text-[10px]">Prep Time</div>
                <div className="font-semibold text-stone-200">{item.prepTimeMinutes} mins</div>
              </div>
            </div>
            <div className="flex items-center gap-2 border-x border-stone-800/80 px-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <div>
                <div className="text-stone-400 text-[10px]">Calories</div>
                <div className="font-semibold text-stone-200">{item.calories} kcal</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <span className="text-sm">🌶️</span>
              <div>
                <div className="text-stone-400 text-[10px]">Spice Level</div>
                <div className="font-semibold text-stone-200">
                  {item.spicyLevel === 0 ? 'Mild' : item.spicyLevel === 1 ? 'Warm' : item.spicyLevel === 2 ? 'Medium' : 'Hot'}
                </div>
              </div>
            </div>
          </div>

          {/* Key Ingredients */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Artisan Ingredients</h3>
            <div className="flex flex-wrap gap-1.5">
              {item.ingredients.map((ing, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-stone-800 text-stone-300 rounded-lg border border-stone-700/50">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Portion Options (if applicable) */}
          {item.portionOptions && item.portionOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Select Portion Size</h3>
                <span className="text-[10px] text-amber-400 font-medium">Required</span>
              </div>
              <div className="space-y-2">
                {item.portionOptions.map((portion) => {
                  const isSelected = selectedPortion?.id === portion.id;
                  return (
                    <button
                      key={portion.id}
                      type="button"
                      onClick={() => setSelectedPortion(portion)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-amber-100 font-semibold'
                          : 'border-stone-800 bg-stone-950/40 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-500 bg-amber-500 text-stone-950' : 'border-stone-600'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-stone-950"></div>}
                        </div>
                        <span>{portion.name}</span>
                      </div>
                      <span className="text-xs font-mono text-stone-400">
                        {portion.priceDelta > 0 ? `+$${portion.priceDelta.toFixed(2)}` : 'Standard'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons & Extras (if applicable) */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Gourmet Add-ons</h3>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-amber-500/10 text-amber-100 font-semibold'
                          : 'border-stone-800 bg-stone-950/40 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'border-amber-500 bg-amber-500 text-stone-950' : 'border-stone-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chef Special Notes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">Special Dietary or Kitchen Notes</h3>
            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra dressing on the side, no cutlery needed, allergy details..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Actions: Quantity Stepper & Add To Cart Button */}
        <div className="p-4 bg-stone-950 border-t border-stone-800/80 flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-stone-900 border border-stone-700/80 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-stone-100 font-mono">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-300 hover:text-white active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Submit Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-98 ${
              addedAnimation
                ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/30'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/25'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-5 h-5 stroke-[2.5]" />
                <span>Added to Order!</span>
              </>
            ) : (
              <>
                <span>Add to Order</span>
                <span>•</span>
                <span className="font-mono">${totalPrice.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

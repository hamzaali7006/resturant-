import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Tag, 
  ArrowRight, 
  Bike, 
  Store, 
  Utensils, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckoutModal } from './CheckoutModal';
import { RESTAURANT_INFO, POPULAR_PROMOS } from '../../data/mockMenu';
import { OrderType } from '../../types/restaurant';

interface CartViewProps {
  onNavigateToMenu: () => void;
  onOpenOrderTracker: () => void;
}

export const CartView: React.FC<CartViewProps> = ({ onNavigateToMenu, onOpenOrderTracker }) => {
  const {
    items,
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
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleApplyPromo = (codeToApply?: string) => {
    const code = (codeToApply || inputCode).trim();
    if (!code) return;
    const res = applyPromoCode(code);
    setPromoFeedback({ text: res.message, isError: !res.success });
    if (res.success) {
      setInputCode('');
    }
  };

  const deliveryProgress = Math.min(100, Math.round((subtotal / RESTAURANT_INFO.freeDeliveryThreshold) * 100));
  const amountForFreeDelivery = Math.max(0, RESTAURANT_INFO.freeDeliveryThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[70vh] text-center text-stone-300">
        <div className="w-20 h-20 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-amber-50">Your Cart is Empty</h2>
        <p className="text-xs text-stone-400 mt-2 max-w-xs leading-relaxed">
          Explore our woodfire culinary creations, artisanal pasta, and handcrafted cocktails.
        </p>

        <button
          onClick={onNavigateToMenu}
          className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span>Explore Artisan Menu</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 pb-24 text-stone-100">
      {/* Header with Clear Cart */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-amber-50">Your Order</h1>
          <span className="text-xs text-stone-400">{totalItemCount} delicious items selected</span>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear all</span>
        </button>
      </div>

      {/* Order Type Segmented Switcher */}
      <div className="p-1 bg-stone-900 border border-stone-800 rounded-2xl grid grid-cols-3 gap-1 text-xs">
        {[
          { type: 'delivery' as OrderType, label: 'Delivery', icon: <Bike className="w-3.5 h-3.5" /> },
          { type: 'pickup' as OrderType, label: 'Pickup', icon: <Store className="w-3.5 h-3.5" /> },
          { type: 'dine_in' as OrderType, label: 'Dine-In', icon: <Utensils className="w-3.5 h-3.5" /> },
        ].map(opt => {
          const isSelected = orderType === opt.type;
          return (
            <button
              key={opt.type}
              onClick={() => setOrderType(opt.type)}
              className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dine-in Table Picker (if Dine-In selected) */}
      {orderType === 'dine_in' && (
        <div className="p-3 bg-stone-900/90 border border-amber-500/30 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-amber-200">Select Seated Table</div>
            <div className="text-[10px] text-stone-400">Order will be delivered to your table</div>
          </div>
          <select
            value={tableNumber || 4}
            onChange={(e) => setTableNumber(Number(e.target.value))}
            className="bg-stone-950 text-amber-300 font-bold border border-stone-700 rounded-xl px-3 py-1.5 focus:outline-none"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
              <option key={n} value={n}>Table #{n}</option>
            ))}
          </select>
        </div>
      )}

      {/* Free Delivery Goal Bar (for Delivery orders) */}
      {orderType === 'delivery' && (
        <div className="p-3 bg-stone-900/80 border border-stone-800 rounded-2xl space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-stone-300 font-medium">
              {amountForFreeDelivery <= 0 ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> You unlocked Free Gourmet Delivery!
                </span>
              ) : (
                <span>Add <strong className="text-amber-400">${amountForFreeDelivery.toFixed(2)}</strong> for Free Delivery</span>
              )}
            </span>
            <span className="text-stone-500 font-mono">{deliveryProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${deliveryProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Cart Items List */}
      <div className="space-y-3">
        {items.map((cartItem) => (
          <div 
            key={cartItem.cartItemId}
            className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 flex gap-3 shadow-md relative"
          >
            {/* Dish Image */}
            <img 
              src={cartItem.item.image} 
              alt={cartItem.item.name} 
              className="w-20 h-20 rounded-xl object-cover bg-stone-950 flex-shrink-0"
            />

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pr-2">
                  <h3 className="font-serif text-sm font-bold text-amber-100 line-clamp-1">
                    {cartItem.item.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(cartItem.cartItemId)}
                    className="text-stone-500 hover:text-red-400 transition-colors p-0.5"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {cartItem.selectedPortion && (
                  <div className="text-[11px] text-amber-400 font-medium">
                    Portion: {cartItem.selectedPortion.name}
                  </div>
                )}

                {cartItem.selectedAddons.length > 0 && (
                  <div className="text-[10px] text-stone-400 line-clamp-1">
                    +{cartItem.selectedAddons.map(a => a.name).join(', ')}
                  </div>
                )}

                {cartItem.specialInstructions && (
                  <div className="text-[10px] text-stone-500 italic line-clamp-1">
                    Note: "{cartItem.specialInstructions}"
                  </div>
                )}
              </div>

              {/* Price and Quantity Stepper */}
              <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-800/60">
                <span className="font-mono text-sm font-bold text-amber-400">
                  ${cartItem.totalPrice.toFixed(2)}
                </span>

                <div className="flex items-center bg-stone-950 rounded-lg border border-stone-800 p-0.5">
                  <button
                    onClick={() => updateQuantity(cartItem.cartItemId, -1)}
                    className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs text-stone-200 font-mono">
                    {cartItem.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(cartItem.cartItemId, 1)}
                    className="w-6 h-6 flex items-center justify-center text-stone-300 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Promo Code Voucher Section */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>Promo Code or Voucher</span>
        </label>

        {appliedPromo ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-amber-300">{appliedPromo.code}</span>
                <p className="text-[11px] text-stone-300">{appliedPromo.description}</p>
              </div>
            </div>
            <button
              onClick={removePromoCode}
              className="text-[11px] text-red-400 hover:text-red-300 underline"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Try: GOURMET20"
              className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 uppercase font-mono"
            />
            <button
              onClick={() => handleApplyPromo()}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl text-xs font-bold border border-stone-700"
            >
              Apply
            </button>
          </div>
        )}

        {/* Promo Suggestions Chips */}
        {!appliedPromo && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] text-stone-500">Quick Apply:</span>
            {POPULAR_PROMOS.map((p) => (
              <button
                key={p.code}
                onClick={() => handleApplyPromo(p.code)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900 border border-amber-500/30 text-amber-400 font-mono hover:bg-amber-500/10"
              >
                {p.code} (20% off)
              </button>
            ))}
          </div>
        )}

        {promoFeedback && (
          <div className={`text-[11px] ${promoFeedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
            {promoFeedback.text}
          </div>
        )}
      </div>

      {/* Tip Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Compliment the Chef & Courier (Tip)
          </label>
          <span className="font-mono text-xs text-amber-400">${tipAmount.toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 text-xs">
          {[0, 10, 15, 20].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => {
                setCustomTip(0);
                setTipPercent(pct);
              }}
              className={`py-2 rounded-xl font-bold border transition-all ${
                customTip === 0 && tipPercent === pct
                  ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
              }`}
            >
              {pct === 0 ? 'None' : `${pct}%`}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const userVal = prompt('Enter custom tip in dollars ($):', '5.00');
              if (userVal) {
                const parsed = parseFloat(userVal);
                if (!isNaN(parsed) && parsed >= 0) setCustomTip(parsed);
              }
            }}
            className={`py-2 rounded-xl font-bold border transition-all ${
              customTip > 0
                ? 'bg-amber-500 text-stone-950 border-amber-500'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
            }`}
          >
            {customTip > 0 ? `$${customTip}` : 'Custom'}
          </button>
        </div>
      </div>

      {/* Bill Breakdown Receipt */}
      <div className="p-4 bg-stone-900/90 rounded-2xl border border-stone-800 space-y-2 text-xs">
        <h4 className="font-serif font-bold text-amber-200 uppercase tracking-wider text-[11px]">Payment Summary</h4>
        
        <div className="flex justify-between text-stone-400">
          <span>Subtotal</span>
          <span className="font-mono text-stone-200">${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-400 font-semibold">
            <span>Promo Discount ({appliedPromo?.code})</span>
            <span className="font-mono">-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-stone-400">
          <span>Delivery Fee {orderType !== 'delivery' && '(Waived)'}</span>
          <span className="font-mono text-stone-200">
            {deliveryFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-stone-400">
          <span>Estimated Restaurant Tax (8.25%)</span>
          <span className="font-mono text-stone-200">${tax.toFixed(2)}</span>
        </div>

        {tipAmount > 0 && (
          <div className="flex justify-between text-stone-400">
            <span>Service Gratuity</span>
            <span className="font-mono text-stone-200">${tipAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-stone-800 flex justify-between items-baseline font-bold text-sm text-stone-100">
          <span>Grand Total</span>
          <span className="font-mono text-xl text-amber-400 font-black">${grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Action Button */}
      <button
        onClick={() => setShowCheckoutModal(true)}
        className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-between active:scale-98 transition-all"
      >
        <span>Proceed to Checkout</span>
        <div className="flex items-center gap-1.5 font-mono text-base font-black">
          <span>${grandTotal.toFixed(2)}</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </div>
      </button>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={() => {
            setShowCheckoutModal(false);
            onOpenOrderTracker();
          }}
        />
      )}
    </div>
  );
};

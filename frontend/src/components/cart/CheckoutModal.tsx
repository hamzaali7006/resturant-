import React, { useState } from 'react';
import { X, CreditCard, Banknote, ShieldCheck, Check, Sparkles, MapPin, Phone, User, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { PaymentMethod } from '../../types/restaurant';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, onSuccess }) => {
  const { grandTotal, orderType, tableNumber, items } = useCart();
  const { placeOrder } = useRestaurant();
  const { userProfile } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gpay');
  const [address, setAddress] = useState<string>(userProfile?.address || '442 Grand Boulevard, Apt 4B');
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile?.phoneNumber || '+1 (555) 723-3766');
  const [recipientName, setRecipientName] = useState<string>(userProfile?.displayName || 'Hamza Ali');
  const [cardNumber, setCardNumber] = useState<string>('•••• •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await placeOrder(paymentMethod, address, recipientName, phoneNumber);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#10b981']
      });

      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to place order.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-amber-100">Checkout & Order Confirmation</h2>
              <span className="text-[11px] text-stone-400 capitalize">{orderType.replace('_', ' ')} Order</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center border border-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 overflow-y-auto space-y-5 flex-1 no-scrollbar text-xs">
          {/* Order destination info */}
          {orderType === 'delivery' && (
            <div className="space-y-2">
              <label className="font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Delivery Street Address</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, apartment or suite"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddress('442 Grand Boulevard, Apt 4B')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800/80 border border-stone-700 text-stone-300 text-[11px] hover:text-white"
                >
                  📍 Home (Grand Blvd)
                </button>
                <button
                  type="button"
                  onClick={() => setAddress('100 Financial Center, 14th Fl')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800/80 border border-stone-700 text-stone-300 text-[11px] hover:text-white"
                >
                  🏢 Office (Financial Ctr)
                </button>
              </div>
            </div>
          )}

          {orderType === 'dine_in' && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between">
              <div>
                <div className="font-bold text-amber-200 text-sm">Dine-in at Restaurant</div>
                <div className="text-stone-300 text-[11px]">Table Number: #{tableNumber || 4}</div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-[11px]">
                Kitchen Express
              </span>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-stone-400 flex items-center gap-1 font-medium">
                <User className="w-3 h-3 text-stone-500" /> Patron Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-stone-400 flex items-center gap-1 font-medium">
                <Phone className="w-3 h-3 text-stone-500" /> Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="font-bold uppercase tracking-wider text-stone-300">
              Payment Method
            </label>
            <div className="space-y-2">
              {/* Google Pay */}
              <button
                type="button"
                onClick={() => setPaymentMethod('gpay')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'gpay'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-100 ring-1 ring-amber-500/40'
                    : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white text-stone-900 font-black flex items-center justify-center text-xs shadow-sm">
                    GPay
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-100">Google Pay (Instant Android Tap)</div>
                    <div className="text-[10px] text-stone-400">One-touch biometric authorization</div>
                  </div>
                </div>
                {paymentMethod === 'gpay' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Credit / Debit Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-100 ring-1 ring-amber-500/40'
                    : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-amber-400 flex items-center justify-center border border-stone-700">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-100">Credit / Debit Card</div>
                    <div className="text-[10px] text-stone-400">Mastercard / Visa ending in 4242</div>
                  </div>
                </div>
                {paymentMethod === 'card' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Cash On Delivery / Dine-in */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-100 ring-1 ring-amber-500/40'
                    : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 text-emerald-400 flex items-center justify-center border border-stone-700">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-stone-100">
                      {orderType === 'dine_in' ? 'Pay at Table' : 'Cash upon Delivery'}
                    </div>
                    <div className="text-[10px] text-stone-400">Exact change or terminal at door</div>
                  </div>
                </div>
                {paymentMethod === 'cash' && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Quick Summary Box */}
          <div className="p-3.5 bg-stone-950 rounded-2xl border border-stone-800 space-y-1.5">
            <div className="flex justify-between text-stone-400">
              <span>Items Total ({items.length}):</span>
              <span className="font-mono text-stone-200">${grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Estimated Delivery/Serving:</span>
              <span className="text-amber-400 font-medium">25-30 minutes</span>
            </div>
            <div className="flex items-center gap-1.5 pt-2 border-t border-stone-800/80 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Synced directly to Firebase Firestore collection `orders`</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-900 rounded-xl text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Securing Order in Firebase...</span>
              </div>
            ) : (
              <>
                <span>Authorize & Pay ${grandTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

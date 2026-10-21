import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  MapPin, 
  Phone, 
  Clock, 
  Flame, 
  ShieldCheck,
  Receipt,
  RotateCw
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/restaurant';
import { useRestaurant } from '../../context/RestaurantContext';

interface OrderTrackerModalProps {
  order: Order;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose }) => {
  const { cancelOrder } = useRestaurant();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);
  const [minutesLeft, setMinutesLeft] = useState<number>(order.estimatedMinutes || 25);

  const steps: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      desc: 'Sent to the kitchen hearth',
      icon: <CheckCircle2 className="w-4 h-4" />
    },
    {
      status: 'preparing',
      label: 'Kitchen Woodfire Grill',
      desc: 'Chef Antonio is searing & plating',
      icon: <ChefHat className="w-4 h-4" />
    },
    {
      status: 'on_the_way',
      label: 'Courier On Route',
      desc: 'Marcus is riding with your insulated bag',
      icon: <Bike className="w-4 h-4" />
    },
    {
      status: 'delivered',
      label: 'Delivered',
      desc: 'Bon Appétit! Enjoy your meal',
      icon: <MapPin className="w-4 h-4" />
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 0;
      case 'preparing': return 1;
      case 'on_the_way': return 2;
      case 'delivered': return 3;
      case 'cancelled': return -1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  // Simulation feature for easy testing: advance to next kitchen/delivery state
  const handleAdvanceSimulation = () => {
    if (currentStatus === 'confirmed' || currentStatus === 'pending') {
      setCurrentStatus('preparing');
      setMinutesLeft(18);
    } else if (currentStatus === 'preparing') {
      setCurrentStatus('on_the_way');
      setMinutesLeft(8);
    } else if (currentStatus === 'on_the_way') {
      setCurrentStatus('delivered');
      setMinutesLeft(0);
    } else if (currentStatus === 'delivered') {
      setCurrentStatus('confirmed');
      setMinutesLeft(28);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-100">
      <div 
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-amber-100">Live Order Tracker</h2>
                <span className="font-mono text-xs text-amber-400 font-bold">#{order.id}</span>
              </div>
              <span className="text-[10px] text-stone-400">Firebase sync • Real-time live status</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center border border-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 no-scrollbar text-xs">
          {/* Animated Delivery Map Simulation */}
          <div className="relative h-44 rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden flex flex-col justify-between p-3.5 shadow-inner">
            {/* Vector Roads Background Graphic */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,30 Q 120,50 200,90 T 400,120" stroke="#f59e0b" strokeWidth="4" fill="none" strokeDasharray="6 4" />
              <path d="M 60,0 Q 150,80 180,180" stroke="#78716c" strokeWidth="2" fill="none" />
              <path d="M 220,0 L 220,180" stroke="#57534e" strokeWidth="2" fill="none" />
              <path d="M 0,140 L 400,140" stroke="#57534e" strokeWidth="2" fill="none" />
            </svg>

            {/* Restaurant Marker */}
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <div className="bg-stone-900/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] font-semibold text-amber-200">
                Saffron & Stone Kitchen
              </div>
            </div>

            {/* Courier Moving Simulation */}
            <div className={`relative z-10 self-center transition-all duration-700 ${
              currentStepIdx === 0 ? 'translate-x-[-80px]' : currentStepIdx === 1 ? 'translate-x-[-30px]' : currentStepIdx === 2 ? 'translate-x-[20px]' : 'translate-x-[80px]'
            }`}>
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-bounce">
                  <Bike className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-extrabold text-emerald-300 bg-stone-950/90 px-1.5 py-0.5 rounded border border-emerald-500/40 mt-1">
                  Courier Marcus
                </span>
              </div>
            </div>

            {/* Destination Marker */}
            <div className="relative z-10 self-end flex items-center gap-2">
              <div className="bg-stone-900/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-stone-800 text-[10px] font-semibold text-stone-200">
                {order.orderType === 'dine_in' ? `Table #${order.tableNumber || 4}` : (order.deliveryAddress || 'Your Address')}
              </div>
              <div className="w-7 h-7 rounded-full bg-sky-500 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-sky-500/30">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Time Estimate Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-stone-900 to-stone-900 border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Estimated Delivery Arrival</div>
              <div className="text-xl font-bold font-serif text-amber-100 mt-0.5">
                {minutesLeft > 0 ? `${minutesLeft} minutes` : 'Just Arrived!'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Progress Steps Timeline */}
          <div className="space-y-4 px-2">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isFuture = idx > currentStepIdx;

              return (
                <div key={step.status} className="flex items-start gap-3.5 relative">
                  {/* Vertical connecting line */}
                  {idx < steps.length - 1 && (
                    <div 
                      className={`absolute left-4 top-8 w-0.5 h-10 -ml-[1px] ${
                        idx < currentStepIdx ? 'bg-amber-400' : 'bg-stone-800'
                      }`}
                    ></div>
                  )}

                  {/* Icon circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                    isPast
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : isCurrent
                      ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-500/30 animate-pulse'
                      : 'bg-stone-800 text-stone-500 border border-stone-700'
                  }`}>
                    {step.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${
                        isCurrent ? 'text-amber-300 font-extrabold' : isPast ? 'text-stone-200' : 'text-stone-500'
                      }`}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isCurrent ? 'text-stone-300' : 'text-stone-500'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Advance Simulation Step Button */}
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold text-stone-200">Interactive Order Flow</div>
              <div className="text-[10px] text-stone-400">Advance order step to preview all stages</div>
            </div>
            <button
              onClick={handleAdvanceSimulation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Simulate Next</span>
            </button>
          </div>

          {/* Items in this Order */}
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs border-b border-stone-800/80 pb-2">
              <span className="font-bold text-amber-200 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                <span>Order Summary</span>
              </span>
              <span className="font-mono text-stone-400">{order.items.length} items</span>
            </div>

            <div className="space-y-2">
              {order.items.map((i) => (
                <div key={i.cartItemId} className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-stone-800 text-stone-300 flex items-center justify-center font-mono text-[10px] font-bold">
                      {i.quantity}x
                    </span>
                    <span className="text-stone-200">{i.item.name}</span>
                  </div>
                  <span className="font-mono text-stone-300">${i.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800/80 flex justify-between items-baseline text-xs font-bold">
              <span className="text-stone-400">Total Paid:</span>
              <span className="font-mono text-amber-400 text-sm font-black">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Call Restaurant Contact info */}
          <div className="flex gap-2">
            <a
              href="tel:+15557233766"
              className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Kitchen</span>
            </a>
            <button
              onClick={() => cancelOrder(order.id)}
              className="py-2.5 px-3 rounded-xl bg-stone-900 border border-red-900/60 text-red-400 hover:bg-red-950/30 text-xs font-semibold"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

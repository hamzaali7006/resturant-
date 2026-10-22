import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  Wine,
  Phone,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { TableZone, RestaurantTable } from '../../types/restaurant';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { TIME_SLOTS } from '../../data/mockMenu';

export const TableBookingView: React.FC = () => {
  const { tables, bookings, bookTable, cancelBooking, firebaseStatus } = useRestaurant();
  const { userProfile, currentUser } = useAuth();

  // Booking Form State
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedZone, setSelectedZone] = useState<TableZone>('main_hall');
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('07:30 PM');
  const [occasion, setOccasion] = useState<string>('Romantic Date');
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [guestName, setGuestName] = useState<string>(userProfile?.displayName || 'Hamza Ali');
  const [guestPhone, setGuestPhone] = useState<string>(userProfile?.phoneNumber || '+1 (555) 723-3766');

  const [bookingSuccessModal, setBookingSuccessModal] = useState<boolean>(false);
  const [lastConfirmedBookingId, setLastConfirmedBookingId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const zones: { id: TableZone; name: string; icon: string; description: string }[] = [
    { id: 'main_hall', name: 'Main Hall', icon: '🏛️', description: 'Warm candlelight & artisan acoustic ambiance' },
    { id: 'patio_garden', name: 'Patio Garden', icon: '🌿', description: 'Lush greenery, hanging lanterns & fountain breeze' },
    { id: 'rooftop_terrace', name: 'Rooftop Terrace', icon: '🌇', description: 'Starlight skyline views with cocktail lounge' },
    { id: 'chefs_counter', name: 'Chef Counter', icon: '👨‍🍳', description: 'Front-row view of the woodfire hearth & plating' },
    { id: 'vip_booth', name: 'VIP Velvet Booth', icon: '👑', description: 'Secluded luxury booth for memorable celebrations' },
  ];

  const occasions = ['Romantic Date', 'Anniversary', 'Birthday Celebration', 'Business Dinner', 'Friends Night Out', 'Casual Tasting'];

  // Filter tables by current zone
  const zoneTables = tables.filter(t => t.zone === selectedZone);

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setIsSubmitting(true);

    try {
      const res = await bookTable({
        guestCount,
        date: selectedDate,
        timeSlot: selectedTime,
        tableZone: selectedZone,
        tableNumber: selectedTableNumber,
        specialNotes,
        occasion,
        name: guestName,
        phone: guestPhone
      });

      setLastConfirmedBookingId(res.id);
      setBookingSuccessModal(true);
    } catch (err: any) {
      setBookingError(err.message || 'Unable to complete reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24 text-stone-100">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/60 p-5 border border-stone-800 shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VIP Dining Experience</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-amber-50">Reserve Your Table</h1>
          <p className="text-xs text-stone-300 mt-1 max-w-xs">
            Experience our Michelin-inspired woodfire cuisine in curated dining atmospheres.
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl"></div>
      </div>

      {/* Existing Active Bookings (if any) */}
      {bookings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">Your Reservations</h2>
            <span className="text-[11px] text-stone-400">{bookings.length} upcoming</span>
          </div>

          <div className="space-y-2">
            {bookings.slice(0, 2).map((b) => (
              <div 
                key={b.id} 
                className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 flex items-start justify-between gap-3 shadow-md"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-200">Table #{b.tableNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                      Confirmed
                    </span>
                    {b.syncedToFirebase && (
                      <span className="text-[10px] text-stone-400 flex items-center gap-0.5" title="Saved to Firebase Firestore">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Firebase
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-stone-300 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> {b.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {b.timeSlot}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-stone-400" /> {b.guests} Guests
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-400 capitalize">
                    Zone: {b.tableZone.replace('_', ' ')} {b.occasion ? `• ${b.occasion}` : ''}
                  </div>
                </div>

                <button
                  onClick={() => cancelBooking(b.id)}
                  className="text-[11px] text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-900/60"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Booking Form */}
      <form onSubmit={handleConfirmReservation} className="space-y-5">
        {/* Step 1: Select Guests Count */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Number of Guests</span>
          </label>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
              <button
                type="button"
                key={num}
                onClick={() => setGuestCount(num)}
                className={`w-11 h-11 flex-shrink-0 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  guestCount === num
                    ? 'bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Reservation Date</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Preferred Time</span>
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-stone-900 border border-stone-800 rounded-2xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 3: Choose Dining Ambiance Zone */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Dining Zone</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {zones.map((zone) => {
              const isSelected = selectedZone === zone.id;
              return (
                <button
                  type="button"
                  key={zone.id}
                  onClick={() => {
                    setSelectedZone(zone.id);
                    // auto pick first available table in zone
                    const firstInZone = tables.find(t => t.zone === zone.id && t.isAvailable);
                    if (firstInZone) setSelectedTableNumber(firstInZone.number);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-amber-100 shadow-md ring-1 ring-amber-500/40'
                      : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xl mb-1">{zone.icon}</div>
                  <div className="font-semibold text-xs text-amber-100">{zone.name}</div>
                  <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">{zone.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Visual Table Selection Floor Plan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
              <span>Interactive Floor Plan ({selectedZone.replace('_', ' ')})</span>
            </label>
            <span className="text-[10px] text-amber-400">Tap table to seat</span>
          </div>

          <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {zoneTables.map((table) => {
              const isSelected = selectedTableNumber === table.number;
              const isAvail = table.isAvailable;

              return (
                <button
                  type="button"
                  key={table.id}
                  disabled={!isAvail}
                  onClick={() => setSelectedTableNumber(table.number)}
                  className={`relative p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                    !isAvail
                      ? 'border-stone-800/40 bg-stone-900/20 text-stone-600 cursor-not-allowed opacity-60'
                      : isSelected
                      ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-lg ring-2 ring-amber-400/50'
                      : 'border-stone-800 bg-stone-900 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">Table {table.number}</div>
                  <div className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" />
                    <span>Up to {table.capacity}p</span>
                  </div>
                  <div className="mt-1">
                    {isAvail ? (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                        {isSelected ? 'Selected' : 'Available'}
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-stone-800 text-stone-500">
                        Reserved
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 5: Special Occasion */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <Wine className="w-3.5 h-3.5 text-amber-400" />
            <span>Dining Occasion</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {occasions.map((occ) => (
              <button
                type="button"
                key={occ}
                onClick={() => setOccasion(occ)}
                className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                  occasion === occ
                    ? 'border-amber-500 bg-amber-500 text-stone-950 font-bold'
                    : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Guest Contact & Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-400 flex items-center gap-1">
              <User className="w-3 h-3 text-stone-500" /> Reservation Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. Hamza Ali"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-400 flex items-center gap-1">
              <Phone className="w-3 h-3 text-stone-500" /> Phone Number
            </label>
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+1 (555) 723-3766"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-400">Special Requests / Dietary Restrictions</label>
          <textarea
            rows={2}
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="e.g. High chair needed, anniversary cake celebration, quiet booth..."
            className="w-full bg-stone-900 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {bookingError && (
          <div className="p-3 bg-red-950/40 border border-red-900 rounded-xl text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* Submit Booking Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Reserving Table #{selectedTableNumber}...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Confirm Table #{selectedTableNumber} Reservation</span>
            </>
          )}
        </button>
      </form>

      {/* Confirmation Modal Receipt */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-stone-900 border border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl relative">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Reservation Confirmed</span>
              <h3 className="font-serif text-2xl font-bold text-amber-50 mt-1">We'll See You Soon!</h3>
              <p className="text-xs text-stone-300 mt-1">
                Your table at Saffron & Stone is held and guaranteed.
              </p>
            </div>

            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Booking Ref:</span>
                <span className="font-mono text-amber-400 font-bold">{lastConfirmedBookingId || 'CONF-8821'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date & Time:</span>
                <span className="text-stone-200 font-medium">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Table & Zone:</span>
                <span className="text-stone-200 font-medium">Table #{selectedTableNumber} ({selectedZone.replace('_', ' ')})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Party Size:</span>
                <span className="text-stone-200 font-medium">{guestCount} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Occasion:</span>
                <span className="text-amber-300 font-medium">{occasion}</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved to Firestore database & client pass</span>
            </div>

            <button
              onClick={() => setBookingSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md hover:bg-amber-400"
            >
              Done & View Passes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

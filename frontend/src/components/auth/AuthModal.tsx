import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Sparkles, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'signup' }) => {
  const { signup, login, loginDemo, error, clearError, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalSuccess(null);

    try {
      if (mode === 'signup') {
        await signup(email, password, name, phoneNumber);
        setLocalSuccess('Account created successfully! Welcome to Saffron & Stone.');
      } else {
        await login(email, password);
        setLocalSuccess('Welcome back!');
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      // Error handled in AuthContext
    }
  };

  const handleDemoLogin = async (role: 'vip' | 'regular') => {
    clearError();
    await loginDemo(role);
    setLocalSuccess('Logged in as VIP Patron!');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-stone-100">
      <div 
        className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-br from-stone-900 to-amber-950/40 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-50">
                {mode === 'signup' ? 'Create Patron Account' : 'Welcome Back'}
              </h2>
              <p className="text-[11px] text-stone-400">
                Connected to Firebase Auth & Firestore
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 flex items-center justify-center border border-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-1.5 bg-stone-950 mx-5 mt-4 rounded-xl border border-stone-800 grid grid-cols-2 gap-1 text-xs">
          <button
            type="button"
            onClick={() => { setMode('signup'); clearError(); }}
            className={`py-2 rounded-lg font-bold transition-all ${
              mode === 'signup'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Create Account (Sign Up)
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); clearError(); }}
            className={`py-2 rounded-lg font-bold transition-all ${
              mode === 'login'
                ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Log In
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {mode === 'signup' && (
            <>
              <div className="space-y-1">
                <label className="text-stone-300 font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hamza Ali"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-stone-300 font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" /> Phone Number (For Order Updates)
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 723-3766"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-stone-300 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. hamzaalibutt70@gmail.com"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-stone-300 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-950/50 border border-red-900 rounded-xl text-red-300 flex items-center gap-2 text-[11px]">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {localSuccess && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-900 rounded-xl text-emerald-300 flex items-center gap-2 text-[11px]">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{localSuccess}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting to Firebase...</span>
              </div>
            ) : (
              <span>{mode === 'signup' ? 'Sign Up & Get 150 VIP Points' : 'Sign In to Account'}</span>
            )}
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="px-5 pb-5 pt-1 text-center border-t border-stone-800/80">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest block mb-2">Or Instant Test Login</span>
          <button
            type="button"
            onClick={() => handleDemoLogin('vip')}
            className="w-full py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>👑 One-Click Demo Account (Hamza Ali - VIP)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

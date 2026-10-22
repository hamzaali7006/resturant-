import React, { useState } from 'react';
import { Smartphone, Maximize2, ShieldCheck, Flame, RotateCcw } from 'lucide-react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { useRestaurant } from '../../context/RestaurantContext';

interface AndroidDeviceShellProps {
  children: React.ReactNode;
}

export const AndroidDeviceShell: React.FC<AndroidDeviceShellProps> = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState<'device' | 'fullscreen'>('device');
  const { firebaseStatus } = useRestaurant();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-start p-0 md:py-6 md:px-4 selection:bg-amber-500/30">
      {/* Top Controller Bar for AI Studio Preview */}
      <header className="w-full max-w-4xl mb-4 px-4 py-2 bg-stone-900/80 backdrop-blur-md rounded-2xl border border-stone-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Flame className="w-5 h-5 text-stone-950 font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-sm font-bold text-amber-100 tracking-wide">Saffron & Stone</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Android & Web Native
              </span>
            </div>
            <p className="text-[11px] text-stone-400">
              Database: <span className="text-amber-400 font-mono">myresturent-36f45 (Firebase)</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Firebase Connection Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/90 border border-stone-700/80 text-[11px]">
            <span className={`w-2 h-2 rounded-full ${firebaseStatus === 'connected' ? 'bg-emerald-400 ring-2 ring-emerald-500/30' : 'bg-amber-400 animate-pulse'}`}></span>
            <span className="text-stone-300 font-medium">
              {firebaseStatus === 'connected' ? 'Firebase Live' : 'Firebase Ready'}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setDeviceMode('device')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceMode === 'device'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="View in Android Smartphone Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android Phone</span>
            </button>
            <button
              onClick={() => setDeviceMode('fullscreen')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                deviceMode === 'fullscreen'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Expanded Responsive View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expanded</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      {deviceMode === 'device' ? (
        <div className="relative">
          {/* Android Phone Outer Chassis (Samsung / Pixel Flagship style) */}
          <div className="w-[390px] h-[824px] max-w-[94vw] max-h-[88vh] bg-stone-900 rounded-[48px] p-[10px] shadow-2xl ring-1 ring-stone-700/70 shadow-amber-950/20 flex flex-col relative overflow-hidden transition-all duration-300">
            {/* Side hardware buttons (Power & Volume rocker) */}
            <div className="absolute -left-[3px] top-28 w-[3px] h-14 bg-stone-700 rounded-l-sm"></div>
            <div className="absolute -right-[3px] top-24 w-[3px] h-9 bg-stone-700 rounded-r-sm"></div>
            <div className="absolute -right-[3px] top-36 w-[3px] h-9 bg-stone-700 rounded-r-sm"></div>

            {/* Inner Screen Display */}
            <div className="w-full h-full bg-stone-950 rounded-[38px] overflow-hidden flex flex-col relative border border-stone-800/80">
              <AndroidStatusBar />
              <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#0d0f12]">
                {children}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen responsive container */
        <div className="w-full max-w-4xl bg-stone-950 rounded-3xl border border-stone-800/80 shadow-2xl overflow-hidden flex flex-col min-h-[800px]">
          <AndroidStatusBar />
          <div className="flex-1 overflow-y-auto relative flex flex-col bg-[#0d0f12]">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bell } from 'lucide-react';

export const AndroidStatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-stone-950/95 text-stone-300 text-xs px-5 pt-2 pb-1.5 flex items-center justify-between select-none z-50 border-b border-stone-800/40 backdrop-blur-md">
      {/* Time & Android Notification icons */}
      <div className="flex items-center gap-2">
        <span className="font-semibold tracking-tight text-[13px] text-stone-200">{time || '12:30'}</span>
        <div className="hidden sm:flex items-center gap-1.5 text-amber-500/80">
          <Bell className="w-3 h-3" />
        </div>
      </div>

      {/* Front Camera Punch-Hole Simulation */}
      <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-stone-800 flex items-center justify-center shadow-inner">
        <div className="w-1.5 h-1.5 rounded-full bg-stone-900 ring-1 ring-blue-950/40"></div>
      </div>

      {/* Status Icons: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-2 text-stone-300">
        <span className="text-[10px] font-bold tracking-wider text-amber-400/90">5G</span>
        <Wifi className="w-3.5 h-3.5 text-stone-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-medium text-stone-300">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400 rotate-90" />
        </div>
      </div>
    </div>
  );
};

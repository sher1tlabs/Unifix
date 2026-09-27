import React from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';
import { BottomNav } from './BottomNav';

export const PhoneSimulatorWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceMode, setDeviceMode } = useApp();

  if (deviceMode === 'responsive') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <main className="flex-1 w-full">
          {children}
        </main>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    );
  }

  // Mobile Device Simulator Chassis Mode
  return (
    <div className="min-h-screen bg-slate-200/80 py-0 lg:py-8 px-0 lg:px-4 flex flex-col items-center justify-center transition-all">
      {/* Device Frame */}
      <div className="w-full lg:max-w-[430px] min-h-screen lg:min-h-[860px] lg:max-h-[920px] bg-slate-50 lg:rounded-[44px] shadow-2xl lg:ring-12 lg:ring-slate-900 overflow-hidden flex flex-col relative border-x border-slate-200 lg:border-none">
        {/* iOS Style Status Bar */}
        <div className="hidden lg:flex items-center justify-between px-6 pt-3 pb-2 bg-white/95 text-slate-900 text-xs font-semibold z-40 select-none border-b border-slate-100">
          <span>9:41</span>
          {/* Dynamic Island Pill */}
          <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5 text-slate-700">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Inner Scrollable Screen */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          {children}
        </div>

        {/* Bottom Tab Bar */}
        <BottomNav />

        {/* Home Indicator bar */}
        <div className="hidden lg:block w-32 h-1 bg-slate-900/40 rounded-full mx-auto my-1.5 z-50 pointer-events-none" />
      </div>

      {/* Floating Mode Helper on Desktop */}
      <div className="hidden lg:flex items-center gap-2 mt-3 text-xs text-slate-500">
        <span>Smartphone Preview Mode</span>
        <span>·</span>
        <button
          onClick={() => setDeviceMode('responsive')}
          className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline flex items-center gap-1"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Switch to Full Width</span>
        </button>
      </div>
    </div>
  );
};

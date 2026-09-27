import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Smartphone, Monitor, UserCheck, Wrench, Building2, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    deviceMode, 
    setDeviceMode, 
    setShowPrivacyModal, 
    setShowUserSwitcherModal,
    activeTab,
    setActiveTab,
    notices
  } = useApp();

  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <button 
            onClick={() => setActiveTab('feed')}
            className="text-left group"
          >
            <div className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
              <span>UniFix</span>
              <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                Campus Estate
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">
              University Infrastructure Management
            </p>
          </button>
        </div>

        {/* Zone 2: Desktop / Wide nav links (Visible on wider screens) */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('feed')}
            className={`transition-colors py-1 ${activeTab === 'feed' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : 'hover:text-slate-900'}`}
          >
            Live Community Feed
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`transition-colors py-1 ${activeTab === 'report' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : 'hover:text-slate-900'}`}
          >
            Report Damage
          </button>
          <button
            onClick={() => setActiveTab('my_reports')}
            className={`transition-colors py-1 ${activeTab === 'my_reports' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : 'hover:text-slate-900'}`}
          >
            My Reports
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${activeTab === 'notices' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : 'hover:text-slate-900'}`}
          >
            <span>Notices</span>
            {notices.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${activeTab === 'admin' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : 'hover:text-slate-900'}`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Admin Oversight</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Role Control */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Privacy Shield Info Button */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Student Phone & Info Privacy Protected"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Privacy Shield</span>
          </button>

          {/* Device Frame Mode Toggle (Mobile chassis vs Fluid Wide) */}
          <button
            onClick={() => setDeviceMode(deviceMode === 'mobile' ? 'responsive' : 'mobile')}
            className="hidden lg:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title={deviceMode === 'mobile' ? 'Switch to Fluid Desktop Layout' : 'Switch to Smartphone Simulator'}
          >
            {deviceMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium">Full Width</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium">Mobile View</span>
              </>
            )}
          </button>

          {/* Active User Switcher Pill */}
          <button
            onClick={() => setShowUserSwitcherModal(true)}
            className="flex items-center gap-2 text-xs text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-600 ring-2 ring-purple-200' : 'bg-emerald-500'}`} />
            <div className="text-left hidden xs:block">
              <span className="font-semibold text-slate-900 block leading-none truncate max-w-[110px]">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight block">
                {isAdmin ? 'Estate Admin' : 'Student Mode'}
              </span>
            </div>
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

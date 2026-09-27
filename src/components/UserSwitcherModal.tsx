import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Shield, GraduationCap, X, Check } from 'lucide-react';
import { PRESET_USERS } from '../data/initialData';

export const UserSwitcherModal: React.FC = () => {
  const { 
    showUserSwitcherModal, 
    setShowUserSwitcherModal, 
    currentUser, 
    switchUser,
    setActiveTab,
    resetDemoData
  } = useApp();

  if (!showUserSwitcherModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Switch Role / Campus Profile
              </h2>
              <span className="text-[10px] text-slate-500">Test Student & Admin perspectives</span>
            </div>
          </div>
          <button
            onClick={() => setShowUserSwitcherModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-2">
          {PRESET_USERS.map((user) => {
            const isSelected = currentUser.id === user.id;
            const isAdmin = user.role === 'admin';

            return (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  switchUser(user.id);
                  if (isAdmin) {
                    setActiveTab('admin');
                  }
                  setShowUserSwitcherModal(false);
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-xs ${
                    isAdmin ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {isAdmin ? <Shield className="w-5 h-5" /> : <GraduationCap className="w-5 h-5 text-indigo-700" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {user.name}
                      </span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                        isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {user.department} · {user.identifier}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Private Phone: {user.phone}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset to initial sample damage reports?')) {
                resetDemoData();
                setShowUserSwitcherModal(false);
              }
            }}
            className="text-[11px] text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            Reset Sample Data
          </button>

          <button
            type="button"
            onClick={() => setShowUserSwitcherModal(false)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

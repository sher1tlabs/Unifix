import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, X } from 'lucide-react';

export const PrivacyPolicyModal: React.FC = () => {
  const { showPrivacyModal, setShowPrivacyModal } = useApp();

  if (!showPrivacyModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Student & Member Privacy Shield
              </h2>
              <span className="text-[10px] text-emerald-700 font-semibold">Active University Data Isolation</span>
            </div>
          </div>
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3.5 text-xs text-slate-600">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-950 block">Phone Numbers Are Strictly Masked</span>
              <p className="text-emerald-900 text-[11px] mt-0.5 leading-relaxed">
                When you report damage or post comments, fellow students, faculty, and peer campus users will NEVER see your phone number or student roll number.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs">How it works:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Pseudonymous Badges:</strong> Reports appear under safe community aliases like <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">Student #492 · CS Dept</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Admin Clearance Only:</strong> Only the verified Estate & Works Directorate admin can view reporter contact details, strictly to coordinate room access or ask for key permissions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800">Anti-Harassment Guard:</strong> Direct student-to-student messaging is prohibited to eliminate spam and protect reporting anonymity.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={() => setShowPrivacyModal(false)}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          Got It, I'm Protected
        </button>
      </div>
    </div>
  );
};

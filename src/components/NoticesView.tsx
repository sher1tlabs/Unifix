import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, AlertTriangle, Info, CheckCircle2, Building, Plus } from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { notices, currentUser, setActiveTab } = useApp();
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="pb-24 max-w-xl mx-auto px-4 py-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <Bell className="w-4 h-4" />
              <span>Campus Broadcasts</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              Estate Works & Maintenance Notices
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Official updates on scheduled repairs, pipe maintenance, and classroom closures.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
            >
              + Post Notice
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notices.map(notice => {
          const isUrgent = notice.urgency === 'urgent';
          const isWarning = notice.urgency === 'warning';

          return (
            <div
              key={notice.id}
              className={`rounded-2xl p-4 border transition-all ${
                isUrgent
                  ? 'bg-red-50/70 border-red-200'
                  : isWarning
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    isUrgent ? 'bg-red-600 text-white' : isWarning ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {notice.building}
                  </span>
                  <span className="text-[11px] text-slate-500">{notice.date}</span>
                </div>

                <span className="text-[10px] font-semibold text-slate-500">
                  {notice.author}
                </span>
              </div>

              <h2 className="text-sm font-bold text-slate-900">
                {notice.title}
              </h2>

              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {notice.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

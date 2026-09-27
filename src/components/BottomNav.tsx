import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Plus, ClipboardList, Shield, Bell } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, issues, notices, currentUser } = useApp();
  const isAdmin = currentUser.role === 'admin';

  const myReportsCount = issues.filter(i => i.reporterId === currentUser.id).length;
  const adminPendingCount = issues.filter(i => i.status === 'reported' || i.status === 'under_review').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe transition-all">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {/* Tab 1: Live Feed */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors cursor-pointer ${
            activeTab === 'feed' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium tracking-tight mt-1">
            Feed
          </span>
        </button>

        {/* Tab 2: Notices */}
        <button
          onClick={() => setActiveTab('notices')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
            activeTab === 'notices' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-5 h-5" />
          {notices.length > 0 && (
            <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-500" />
          )}
          <span className="text-[10px] font-medium tracking-tight mt-1">
            Notices
          </span>
        </button>

        {/* Tab 3: Report Camera (Hero Action in thumb zone) */}
        <div className="flex justify-center -mt-4">
          <button
            onClick={() => setActiveTab('report')}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'report'
                ? 'bg-indigo-700 text-white shadow-indigo-600/30 ring-4 ring-indigo-100'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
            title="Upload damage photo & room location"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: My Reports */}
        <button
          onClick={() => setActiveTab('my_reports')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
            activeTab === 'my_reports' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-5 h-5" />
          {myReportsCount > 0 && (
            <span className="absolute top-2 right-3 min-w-[16px] h-4 px-1 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center">
              {myReportsCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight mt-1">
            My Tickets
          </span>
        </button>

        {/* Tab 5: Admin Oversight */}
        <button
          onClick={() => setActiveTab('admin')}
          className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative transition-colors cursor-pointer ${
            activeTab === 'admin' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-5 h-5" />
          {adminPendingCount > 0 && (
            <span className="absolute top-2 right-3 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
              {adminPendingCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight mt-1">
            {isAdmin ? 'Admin Portal' : 'Admin View'}
          </span>
        </button>
      </div>
    </nav>
  );
};

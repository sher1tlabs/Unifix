import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardList, Plus, MapPin, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { CATEGORY_META, STATUS_META, PRIORITY_META } from '../utils/helpers';

export const MyReportsView: React.FC = () => {
  const { issues, currentUser, setSelectedIssue, setActiveTab } = useApp();

  const myIssues = issues.filter(i => i.reporterId === currentUser.id);

  return (
    <div className="pb-24 max-w-xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
              <ClipboardList className="w-4 h-4" />
              <span>Personal Tracking</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              My Reported Issues
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as: <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.identifier})
            </p>
          </div>

          <button
            onClick={() => setActiveTab('report')}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {myIssues.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">You haven't reported any damages yet</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Notice a cracked wall, leaking tap, or broken desk in your lecture room? Report it with a photo to alert the Estate Office.
          </p>
          <button
            onClick={() => setActiveTab('report')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
          >
            Report Damage
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myIssues.map(issue => {
            const cat = CATEGORY_META[issue.category];
            const stat = STATUS_META[issue.status];

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-bold text-indigo-700 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                      {issue.room}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.bg} ${stat.text} shrink-0`}>
                      {stat.label}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 truncate">
                    {issue.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>{issue.building}</span>
                    <span>·</span>
                    <span>{issue.reportedAt}</span>
                    <span>·</span>
                    <span>{issue.comments.length} updates</span>
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

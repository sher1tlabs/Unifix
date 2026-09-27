import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  ThumbsUp, 
  Send, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Share2, 
  Building2,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { CATEGORY_META, STATUS_META, PRIORITY_META, getReporterPrivacyDetails } from '../utils/helpers';
import { IssueStatus } from '../types';

export const IssueDetailModal: React.FC = () => {
  const { 
    selectedIssue, 
    setSelectedIssue, 
    currentUser, 
    toggleUpvote, 
    addComment,
    updateIssueStatus
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isOfficialUpdate, setIsOfficialUpdate] = useState(currentUser.role === 'admin');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedIssue) return null;

  const cat = CATEGORY_META[selectedIssue.category];
  const stat = STATUS_META[selectedIssue.status];
  const prio = PRIORITY_META[selectedIssue.priority];
  const privacy = getReporterPrivacyDetails(selectedIssue, currentUser);
  const hasUpvoted = selectedIssue.upvotedBy.includes(currentUser.id);
  const isAdmin = currentUser.role === 'admin';

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedIssue.id, commentText, isOfficialUpdate);
    setCommentText('');
  };

  const handleShare = () => {
    const text = `UniFix Campus Infrastructure Ticket: ${selectedIssue.title} at ${selectedIssue.room}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Status Stepper Steps
  const STEPS: { key: IssueStatus; label: string }[] = [
    { key: 'reported', label: 'Reported' },
    { key: 'assigned', label: 'Assigned' },
    { key: 'in_progress', label: 'Repairing' },
    { key: 'resolved', label: 'Fixed' }
  ];

  const getStepIndex = (status: IssueStatus) => {
    if (status === 'reported') return 0;
    if (status === 'under_review') return 0;
    if (status === 'assigned') return 1;
    if (status === 'in_progress') return 2;
    if (status === 'resolved') return 3;
    return -1;
  };

  const currentStepIdx = getStepIndex(selectedIssue.status);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col animate-in fade-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-bold text-indigo-300">Ticket #{selectedIssue.id.replace('issue-', '')}</span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300 truncate font-medium">{selectedIssue.building}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Share / Copy details"
            >
              {copiedLink ? (
                <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setSelectedIssue(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Main Photo with Location Pin */}
          <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-sm">
            <img
              src={selectedIssue.imageUrl}
              alt={selectedIssue.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay Location Chip */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-md flex items-center gap-1.5 truncate max-w-[85%]">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{selectedIssue.room}</span>
              </div>

              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${stat.bg} ${stat.text} shadow-md`}>
                {stat.label}
              </div>
            </div>
          </div>

          {/* Location & Title */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-indigo-700">{selectedIssue.building}</span>
              <span>·</span>
              <span>{selectedIssue.floor}</span>
              {selectedIssue.landmark && (
                <>
                  <span>·</span>
                  <span className="text-slate-400">{selectedIssue.landmark}</span>
                </>
              )}
              <span>·</span>
              <span className="font-medium text-slate-600">{cat.label}</span>
            </div>

            <h1 className="text-base font-bold text-slate-900 leading-snug">
              {selectedIssue.title}
            </h1>

            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedIssue.description}
            </p>
          </div>

          {/* Repair Progress Stepper */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
              Estate Works Resolution Status
            </span>

            <div className="grid grid-cols-4 gap-1 relative">
              {STEPS.map((step, idx) => {
                const isPassed = currentStepIdx >= idx;
                const isCurrent = currentStepIdx === idx;

                return (
                  <div key={step.key} className="text-center">
                    <div className="relative flex items-center justify-center mb-1">
                      {idx > 0 && (
                        <div 
                          className={`absolute left-0 right-1/2 top-1/2 -translate-y-1/2 h-0.5 -z-10 ${
                            isPassed ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      {idx < STEPS.length - 1 && (
                        <div 
                          className={`absolute left-1/2 right-0 top-1/2 -translate-y-1/2 h-0.5 -z-10 ${
                            currentStepIdx > idx ? 'bg-indigo-600' : 'bg-slate-200'
                          }`}
                        />
                      )}
                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isPassed
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-500'
                        } ${isCurrent ? 'ring-3 ring-indigo-100' : ''}`}
                      >
                        {idx + 1}
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold block ${isPassed ? 'text-indigo-700' : 'text-slate-400'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {selectedIssue.assignedTeam && selectedIssue.status !== 'resolved' && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-blue-900">
                <span className="font-semibold">Crew: {selectedIssue.assignedTeam}</span>
                {selectedIssue.estimatedCompletion && (
                  <span className="text-[11px] text-blue-700 font-bold">ETA: {selectedIssue.estimatedCompletion}</span>
                )}
              </div>
            )}
          </div>

          {/* Student Privacy & Reporter Shield (Prompt Mandate) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {privacy.displayName}
                  </span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.5 rounded">
                    {privacy.aliasBadge}
                  </span>
                </div>
                
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {privacy.privacyNotice}
                </p>

                {/* Admin-only contact disclosure */}
                {privacy.canViewContact && isAdmin && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Reporter Phone:</span>
                        <a href={`tel:${privacy.phone}`} className="font-bold text-slate-900 hover:underline">
                          {privacy.phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <div className="truncate">
                        <span className="text-[10px] text-slate-400 block">Campus Email:</span>
                        <a href={`mailto:${privacy.email}`} className="font-medium text-slate-900 hover:underline truncate block">
                          {privacy.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp-Style Community Comments & Estate Updates */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span>Discussion & Maintenance Log</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                  {selectedIssue.comments.length}
                </span>
              </h2>
              <span className="text-[10px] text-slate-400">All comments are privacy-shielded</span>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {selectedIssue.comments.map((comment) => (
                <div 
                  key={comment.id}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    comment.isOfficialAdminUpdate
                      ? 'bg-purple-50 border border-purple-200/80'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold ${comment.isOfficialAdminUpdate ? 'text-purple-900' : 'text-slate-900'}`}>
                        {comment.userAlias}
                      </span>
                      {comment.isOfficialAdminUpdate && (
                        <span className="bg-purple-600 text-white text-[9px] font-extrabold px-1 rounded">
                          OFFICIAL
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                  </div>
                  <p className={comment.isOfficialAdminUpdate ? 'text-purple-950 font-medium' : 'text-slate-700'}>
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comment Input & Actions pinned at bottom */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <form onSubmit={handleSendComment} className="flex items-center gap-2">
            <input
              type="text"
              placeholder={isAdmin ? "Post official estate update or note..." : "Add observation (e.g., Still leaking, debris cleared)..."}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors cursor-pointer shrink-0"
              title="Post comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick React Bar */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => toggleUpvote(selectedIssue.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasUpvoted ? 'bg-indigo-100 text-indigo-700' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-indigo-600' : ''}`} />
              <span>{selectedIssue.upvotes} Students Confirmed</span>
            </button>

            {isAdmin && selectedIssue.status !== 'resolved' && (
              <button
                type="button"
                onClick={() => updateIssueStatus(selectedIssue.id, 'resolved', { notes: 'Repaired by Estate maintenance' })}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quick Resolve</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

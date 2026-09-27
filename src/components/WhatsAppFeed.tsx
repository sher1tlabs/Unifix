import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  MapPin, 
  ThumbsUp, 
  MessageCircle, 
  ShieldCheck, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Share2,
  Wrench,
  Sparkles
} from 'lucide-react';
import { CATEGORY_META, STATUS_META, PRIORITY_META, getReporterPrivacyDetails } from '../utils/helpers';
import { BuildingBlock, IssueReport } from '../types';

const BUILDING_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Campus' },
  { id: 'AB-1', label: 'AB-1' },
  { id: 'AB-2', label: 'AB-2' },
  { id: 'Central Library', label: 'Library' },
  { id: 'Science & Tech Block', label: 'Science Block' },
  { id: 'Student Center & Cafeteria', label: 'Student Center' },
  { id: 'Boys Hostel 1', label: 'Hostel 1' },
  { id: 'Girls Hostel 1', label: 'Girls Hostel' }
];

export const WhatsAppFeed: React.FC = () => {
  const { 
    issues, 
    currentUser, 
    setSelectedIssue, 
    toggleUpvote, 
    setActiveTab, 
    filterBuilding, 
    setFilterBuilding,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    notices
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter issues based on search, building, and status
  const filteredIssues = issues.filter(issue => {
    // Building filter
    if (filterBuilding !== 'all' && issue.building !== filterBuilding) {
      return false;
    }
    // Status filter
    if (filterStatus === 'open' && (issue.status === 'resolved' || issue.status === 'rejected')) {
      return false;
    }
    if (filterStatus === 'in_progress' && issue.status !== 'in_progress' && issue.status !== 'assigned') {
      return false;
    }
    if (filterStatus === 'resolved' && issue.status !== 'resolved') {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRoom = issue.room.toLowerCase().includes(q);
      const matchBuilding = issue.building.toLowerCase().includes(q);
      const matchTitle = issue.title.toLowerCase().includes(q);
      const matchDesc = issue.description.toLowerCase().includes(q);
      const matchLandmark = issue.landmark?.toLowerCase().includes(q) || false;
      return matchRoom || matchBuilding || matchTitle || matchDesc || matchLandmark;
    }
    return true;
  });

  const handleShare = (issue: IssueReport, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `UniFix Alert: ${issue.title} at ${issue.room} (${issue.status.toUpperCase()})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(issue.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const latestNotice = notices[0];

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* WhatsApp Group Community Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white px-4 py-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700/80 border border-emerald-400/30 flex items-center justify-center font-bold text-white shadow-inner">
              <Building2 className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-semibold text-sm tracking-tight text-white">
                  Campus Infrastructure Broadcast
                </h1>
                <span className="bg-emerald-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">
                  Official
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 flex items-center gap-1 mt-0.5">
                <span>Active Estate & Works Desk</span>
                <span>·</span>
                <span>4,280 Campus Members</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1 text-xs bg-white text-emerald-900 font-semibold px-3 py-1.5 rounded-lg shadow-sm hover:bg-emerald-50 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>Report</span>
          </button>
        </div>

        {/* WhatsApp-Style Pinned Broadcast Notice */}
        {latestNotice && (
          <div 
            onClick={() => setActiveTab('notices')}
            className="mt-3 bg-emerald-950/60 border border-emerald-500/30 rounded-lg p-2.5 flex items-start gap-2.5 cursor-pointer hover:bg-emerald-950/80 transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-medium text-emerald-300">
                <span className="truncate">📌 Pinned Notice: {latestNotice.building}</span>
                <span className="text-[10px] text-emerald-400/80 shrink-0 ml-1">{latestNotice.date}</span>
              </div>
              <p className="text-xs text-white font-medium truncate mt-0.5">
                {latestNotice.title}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 self-center" />
          </div>
        )}
      </div>

      {/* Search & Location Filter Controls */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-200 sticky top-14 z-20 shadow-xs">
        {/* Search Bar */}
        <div className="relative mb-2.5">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room (e.g., Room 205, AB-1), wall crack, leak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-900 placeholder-slate-400 pl-9 pr-8 py-2 rounded-lg border border-transparent focus:border-indigo-500 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Building Filter Bar (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {BUILDING_FILTERS.map(b => (
            <button
              key={b.id}
              onClick={() => setFilterBuilding(b.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                filterBuilding === b.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Status Segmented Tabs */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-100 text-[11px]">
          <span className="text-slate-400 mr-1 font-medium">Status:</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setFilterStatus('open')}
            className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              filterStatus === 'open' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Needs Repair ({issues.filter(i => i.status !== 'resolved' && i.status !== 'rejected').length})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
              filterStatus === 'resolved' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fixed ({issues.filter(i => i.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* Feed Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Privacy Assurance Banner */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <span className="font-semibold text-emerald-900">Student Privacy Enforced:</span>
            <span className="text-emerald-800 ml-1">
              Personal phone numbers and student roll numbers are strictly shielded from peer users and visible only to verified Estate Office Admins.
            </span>
          </div>
        </div>

        {/* Date separator */}
        <div className="flex items-center justify-center my-2">
          <span className="bg-slate-200 text-slate-600 text-[11px] font-medium px-3 py-0.5 rounded-full shadow-2xs">
            Live Campus Reports Feed
          </span>
        </div>

        {filteredIssues.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No damage reports found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No reported issues match your search criteria. You can be the first to report damage in this area!
            </p>
            <button
              onClick={() => setActiveTab('report')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Report Damage Now
            </button>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const cat = CATEGORY_META[issue.category];
            const stat = STATUS_META[issue.status];
            const prio = PRIORITY_META[issue.priority];
            const privacy = getReporterPrivacyDetails(issue, currentUser);
            const hasUpvoted = issue.upvotedBy.includes(currentUser.id);

            return (
              <article 
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
              >
                {/* Header: Anonymous / Protected Reporter Line */}
                <div className="px-4 pt-3.5 pb-2 flex items-center justify-between text-xs border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                      {issue.reporterAlias.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-800">
                          {privacy.displayName}
                        </span>
                        {!privacy.canViewContact && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title="Personal Phone Protected">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span>{issue.reportedAt}</span>
                        <span>·</span>
                        <span className="text-slate-500 font-medium">{cat.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 ${stat.bg} ${stat.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${stat.dot}`} />
                    <span>{stat.label}</span>
                  </div>
                </div>

                {/* Main Damage Image */}
                <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                  <img
                    src={issue.imageUrl}
                    alt={issue.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Location Banner Overlaid on Image (Like WhatsApp / Instagram Story Tag) */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div className="bg-slate-950/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/20 shadow-lg flex items-center gap-1.5 truncate max-w-[85%]">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="truncate">{issue.room}</span>
                    </div>

                    {issue.priority === 'critical' && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-md shrink-0 animate-pulse">
                        HAZARD
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4">
                  {/* Room Location Meta line */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                    <span className="font-semibold text-indigo-700">{issue.building}</span>
                    <span>·</span>
                    <span>{issue.floor}</span>
                    {issue.landmark && (
                      <>
                        <span>·</span>
                        <span className="truncate text-slate-400">{issue.landmark}</span>
                      </>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                    {issue.title}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>

                  {/* Resolution Proof Notice (if resolved) */}
                  {issue.status === 'resolved' && (
                    <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-semibold text-emerald-900">Resolved by Estate Works:</span>
                        <p className="text-emerald-800 text-[11px] mt-0.5">
                          {issue.resolutionNotes || 'Repairs completed and verified by campus inspector.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Assigned Maintenance Crew Banner (if active) */}
                  {issue.assignedTeam && issue.status !== 'resolved' && (
                    <div className="mt-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="font-medium truncate">Assigned: {issue.assignedTeam}</span>
                      </div>
                      {issue.estimatedCompletion && (
                        <span className="text-[10px] text-blue-600 font-semibold shrink-0 ml-1">
                          ETA: {issue.estimatedCompletion}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Bar (WhatsApp Group Reactions & Chat) */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {/* Upvote / "I saw this too" button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUpvote(issue.id);
                        }}
                        className={`min-h-[36px] px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                          hasUpvoted
                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                        title="Confirm this damage affects classes / campus"
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-indigo-600' : ''}`} />
                        <span>{issue.upvotes} {issue.upvotes === 1 ? 'Vote' : 'Votes'}</span>
                      </button>

                      {/* Comments Thread Button */}
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="min-h-[36px] px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                        <span>{issue.comments.length} {issue.comments.length === 1 ? 'Update' : 'Updates'}</span>
                      </button>
                    </div>

                    {/* Share / Copy Location */}
                    <button
                      onClick={(e) => handleShare(issue, e)}
                      className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Copy issue details"
                    >
                      {copiedId === issue.id ? (
                        <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

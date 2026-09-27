import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Phone, 
  Mail, 
  ChevronRight, 
  MapPin, 
  Plus, 
  Send, 
  BarChart3, 
  Trash2,
  Check,
  Building,
  Sparkles
} from 'lucide-react';
import { CATEGORY_META, STATUS_META, PRIORITY_META, getReporterPrivacyDetails } from '../utils/helpers';
import { IssueStatus, IssuePriority, IssueReport, BuildingBlock } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    issues, 
    currentUser, 
    setSelectedIssue, 
    updateIssueStatus, 
    assignIssueTeam, 
    updateIssuePriority,
    deleteIssue,
    addNotice,
    switchUser,
    users
  } = useApp();

  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all');
  const [buildingFilter, setBuildingFilter] = useState<string>('all');
  const [revealedContacts, setRevealedContacts] = useState<Record<string, boolean>>({});

  // Dispatch modal state
  const [dispatchIssue, setDispatchIssue] = useState<IssueReport | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('Civil & Masonry Works Crew');
  const [techName, setTechName] = useState('Foreman Bashir & Crew');
  const [etaTime, setEtaTime] = useState('Today, 4:00 PM');

  // Resolution modal state
  const [resolveIssue, setResolveIssue] = useState<IssueReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('Repair successfully completed, inspected and signed off by campus maintenance.');

  // Notice creation state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeBuilding, setNoticeBuilding] = useState('AB-1');
  const [noticeUrgency, setNoticeUrgency] = useState<'info' | 'warning' | 'urgent'>('warning');

  const isAdmin = currentUser.role === 'admin';

  // Toggle contact reveal for an issue
  const toggleContactReveal = (issueId: string) => {
    setRevealedContacts(prev => ({ ...prev, [issueId]: !prev[issueId] }));
  };

  // Filtered issues for admin
  const adminIssues = issues.filter(issue => {
    if (buildingFilter !== 'all' && issue.building !== buildingFilter) return false;
    if (filterTab === 'pending' && issue.status !== 'reported' && issue.status !== 'under_review') return false;
    if (filterTab === 'in_progress' && issue.status !== 'assigned' && issue.status !== 'in_progress') return false;
    if (filterTab === 'resolved' && issue.status !== 'resolved') return false;
    return true;
  });

  const pendingCount = issues.filter(i => i.status === 'reported' || i.status === 'under_review').length;
  const inProgressCount = issues.filter(i => i.status === 'assigned' || i.status === 'in_progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const criticalCount = issues.filter(i => i.priority === 'critical' && i.status !== 'resolved').length;

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchIssue) return;
    assignIssueTeam(dispatchIssue.id, selectedTeam, techName, etaTime);
    setDispatchIssue(null);
  };

  const handleResolveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveIssue) return;
    updateIssueStatus(resolveIssue.id, 'resolved', { notes: resolutionNotes });
    setResolveIssue(null);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    addNotice({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      building: noticeBuilding,
      urgency: noticeUrgency
    });
    setNoticeTitle('');
    setNoticeContent('');
    setShowNoticeModal(false);
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 py-4">
      {/* Admin Authorization Top Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Estate Directorate Portal
              </span>
              <span className="text-xs text-slate-400">Campus Oversight & Work Orders</span>
            </div>
            <h1 className="text-lg font-bold text-white mt-1">
              Infrastructure Management Console
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Logged in as: <span className="font-semibold text-white">{currentUser.name}</span> ({currentUser.department})
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAdmin ? (
              <button
                onClick={() => {
                  const adminUser = users.find(u => u.role === 'admin');
                  if (adminUser) switchUser(adminUser.id);
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Switch to Official Admin</span>
              </button>
            ) : (
              <button
                onClick={() => setShowNoticeModal(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Broadcast Notice</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Needs Triage</span>
            <span className="text-xl font-extrabold text-amber-400 mt-0.5 block tabular-nums">
              {pendingCount}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">In Repair</span>
            <span className="text-xl font-extrabold text-blue-400 mt-0.5 block tabular-nums">
              {inProgressCount}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Resolved</span>
            <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block tabular-nums">
              {resolvedCount}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <span className="text-[11px] text-slate-400 block">Critical Hazards</span>
            <span className="text-xl font-extrabold text-rose-400 mt-0.5 block tabular-nums">
              {criticalCount}
            </span>
          </div>
        </div>
      </div>

      {/* Triage Navigation & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({issues.length})
          </button>
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'pending' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Needs Action ({pendingCount})
          </button>
          <button
            onClick={() => setFilterTab('in_progress')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'in_progress' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setFilterTab('resolved')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filterTab === 'resolved' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        <select
          value={buildingFilter}
          onChange={(e) => setBuildingFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Campus Blocks</option>
          <option value="AB-1">Academic Block 1 (AB-1)</option>
          <option value="AB-2">Academic Block 2 (AB-2)</option>
          <option value="Central Library">Central Library</option>
          <option value="Science & Tech Block">Science & Tech Block</option>
          <option value="Student Center & Cafeteria">Student Center</option>
          <option value="Boys Hostel 1">Boys Hostel 1</option>
          <option value="Girls Hostel 1">Girls Hostel 1</option>
        </select>
      </div>

      {/* Admin Issues Table / Cards */}
      <div className="space-y-4">
        {adminIssues.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No tickets in this triage view</h3>
            <p className="text-xs text-slate-500 mt-1">
              All infrastructure reports in this filter category have been resolved or assigned.
            </p>
          </div>
        ) : (
          adminIssues.map((issue) => {
            const stat = STATUS_META[issue.status];
            const cat = CATEGORY_META[issue.category];
            const isRevealed = revealedContacts[issue.id];

            return (
              <div 
                key={issue.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="p-4">
                  {/* Top line: Location & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-indigo-500" />
                        {issue.room}
                      </span>
                      <span className="text-xs text-slate-500">
                        {issue.building} · {issue.floor}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Priority selector */}
                      <select
                        value={issue.priority}
                        onChange={(e) => updateIssuePriority(issue.id, e.target.value as IssuePriority)}
                        className="text-[11px] font-semibold bg-slate-100 border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 cursor-pointer"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical Hazard</option>
                      </select>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stat.bg} ${stat.text}`}>
                        {stat.label}
                      </span>
                    </div>
                  </div>

                  {/* Main content grid: Image & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                    <div 
                      onClick={() => setSelectedIssue(issue)}
                      className="aspect-16/10 rounded-xl overflow-hidden bg-slate-900 cursor-pointer relative group"
                    >
                      <img
                        src={issue.imageUrl}
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                        Inspect Full Photo
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <h3 
                        onClick={() => setSelectedIssue(issue)}
                        className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {issue.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {issue.description}
                      </p>

                      {issue.landmark && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          <span className="font-medium text-slate-500">Landmark:</span> {issue.landmark}
                        </p>
                      )}

                      {/* Work Order Info if assigned */}
                      {issue.assignedTeam && (
                        <div className="mt-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-semibold">Crew:</span> {issue.assignedTeam} ({issue.assignedTech})
                          </div>
                          {issue.estimatedCompletion && (
                            <span className="font-semibold text-blue-700">
                              ETA: {issue.estimatedCompletion}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Resolution Notes if resolved */}
                      {issue.status === 'resolved' && issue.resolutionNotes && (
                        <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                          <span className="font-semibold">Resolution:</span> {issue.resolutionNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confidential Reporter Contact Accordion (Prompt Requirement) */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-semibold text-slate-800">
                            Confidential Student Reporter Information
                          </span>
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                            Admin Only
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleContactReveal(issue.id)}
                          className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer underline"
                        >
                          {isRevealed ? 'Hide Contact Details' : 'Reveal Contact for Room Access'}
                        </button>
                      </div>

                      {isRevealed && (
                        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Student / Reporter Name:</span>
                            <span className="font-bold text-slate-900">{issue.reporterName}</span>
                            <span className="text-[11px] text-slate-500 block">{issue.reporterDepartment}</span>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block">Phone Number (Private):</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-mono font-bold text-slate-900">{issue.reporterPhone}</span>
                              <a
                                href={`tel:${issue.reporterPhone}`}
                                className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                                title="Call Reporter"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block">Email Address:</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-slate-800 font-medium truncate">{issue.reporterEmail}</span>
                              <a
                                href={`mailto:${issue.reporterEmail}`}
                                className="p-1 text-indigo-700 hover:bg-indigo-50 rounded"
                                title="Email Reporter"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Action Buttons */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    {/* Status progression quick buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {issue.status === 'reported' && (
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'under_review')}
                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Mark Under Review
                        </button>
                      )}

                      {issue.status !== 'assigned' && issue.status !== 'in_progress' && issue.status !== 'resolved' && (
                        <button
                          onClick={() => {
                            setDispatchIssue(issue);
                            if (issue.category === 'wall_masonry') {
                              setSelectedTeam('Civil & Masonry Works Crew');
                              setTechName('Foreman Bashir & Crew');
                            } else if (issue.category === 'plumbing_leak') {
                              setSelectedTeam('Emergency Plumbing Riser Team');
                              setTechName('M. Rafiq (Master Plumber)');
                            } else if (issue.category === 'furniture_fixtures') {
                              setSelectedTeam('Campus Carpentry & Desks Unit');
                              setTechName('Carpentry Shop Team');
                            }
                          }}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Dispatch Crew</span>
                        </button>
                      )}

                      {issue.status === 'assigned' && (
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                          className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Crew Started Repairing
                        </button>
                      )}

                      {issue.status !== 'resolved' && (
                        <button
                          onClick={() => {
                            setResolveIssue(issue);
                            setResolutionNotes(`Issue at ${issue.room} repaired and confirmed by campus estate.`);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}

                      {issue.status === 'resolved' && (
                        <button
                          onClick={() => updateIssueStatus(issue.id, 'in_progress')}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Reopen Ticket
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Discussion</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm('Delete this report ticket?')) {
                            deleteIssue(issue.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete Ticket"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Dispatch Crew */}
      {dispatchIssue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              <span>Issue Work Order & Dispatch Crew</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Assigning maintenance personnel for: <span className="font-semibold text-slate-800">{dispatchIssue.room}</span>
            </p>

            <form onSubmit={handleDispatchSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsible Works Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Civil & Masonry Works Crew">Civil & Masonry Works Crew</option>
                  <option value="Emergency Plumbing Riser Team">Emergency Plumbing Riser Team</option>
                  <option value="Campus Electrical Maintenance Unit">Campus Electrical Maintenance Unit</option>
                  <option value="Campus Carpentry & Desks Unit">Campus Carpentry & Desks Unit</option>
                  <option value="HVAC & Central Air Service">HVAC & Central Air Service</option>
                  <option value="Campus Facilities & Sanitation">Campus Facilities & Sanitation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Lead Technician / Contractor
                </label>
                <input
                  type="text"
                  required
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Foreman Bashir & Team"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Turnaround Time
                </label>
                <input
                  type="text"
                  required
                  value={etaTime}
                  onChange={(e) => setEtaTime(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Today, 4:30 PM"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDispatchIssue(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Dispatch Crew & Update Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Resolve Issue */}
      {resolveIssue && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Sign Off & Resolve Damage</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mark issue as completed at: <span className="font-semibold text-slate-800">{resolveIssue.room}</span>
            </p>

            <form onSubmit={handleResolveSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Resolution Notes & Work Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-emerald-500 resize-none"
                  placeholder="Describe what was repaired (e.g., Wall crack replastered, cement cured and painted; leak sealed)..."
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900">
                <span className="font-semibold">Campus Broadcast:</span> All students following this room ticket will be notified that the hazard has been removed.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResolveIssue(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Confirm & Close Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Broadcast Campus Notice */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              <span>Broadcast Campus Maintenance Notice</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pins a high-priority alert across all campus members' feeds.
            </p>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notice Headline
                </label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., Scheduled Water Supply Interruption in AB-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Building
                  </label>
                  <select
                    value={noticeBuilding}
                    onChange={(e) => setNoticeBuilding(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AB-1">AB-1</option>
                    <option value="AB-2">AB-2</option>
                    <option value="Central Library">Central Library</option>
                    <option value="Science & Tech Block">Science & Tech Block</option>
                    <option value="All Campus">Entire Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Urgency Tag
                  </label>
                  <select
                    value={noticeUrgency}
                    onChange={(e) => setNoticeUrgency(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium focus:outline-none focus:border-indigo-500"
                  >
                    <option value="warning">Warning / Caution</option>
                    <option value="urgent">Urgent Closure</option>
                    <option value="info">Informational</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Details & Schedule
                </label>
                <textarea
                  required
                  rows={3}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Specify affected rooms, floors, expected completion time, and safety guidelines..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

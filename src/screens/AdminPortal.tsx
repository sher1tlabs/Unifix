import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { CAMPUS_CATEGORIES, CampusCategory, Post } from '../types/models';
import { 
  Shield, 
  LogOut, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  Trash2,
  ChevronRight,
  Filter
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { posts, selectedCategory, setSelectedCategory, addReply, updateStatus, deletePost } = usePosts();

  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Under Review' | 'In Progress' | 'Resolved'>('All');
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredPosts = posts.filter(post => {
    if (selectedCategory !== 'All Campus' && post.locationCategory !== selectedCategory) {
      return false;
    }
    if (statusFilter !== 'All' && post.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleSendReply = async (postId: string) => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    setActionError(null);
    try {
      await addReply(postId, replyText.trim());
      setReplyText('');
      setActiveReplyPostId(null);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to send reply.');
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusChange = async (postId: string, newStatus: Post['status']) => {
    setActionError(null);
    try {
      await updateStatus(postId, newStatus);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to update status.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to remove this report?')) return;
    setActionError(null);
    try {
      await deletePost(postId);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to delete report.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-sm tracking-tight">UniFix Admin Portal</span>
                <span className="text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded">
                  Official Staff
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: {currentUser?.email || 'admin@campus.edu'}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Categories Bar */}
        <div className="border-t border-slate-800 bg-slate-950/60">
          <div className="max-w-5xl mx-auto px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {CAMPUS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Admin Console */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5">
        {actionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {actionError}
          </div>
        )}

        {/* Triage & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-white p-3.5 rounded-2xl border border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Student Infrastructure Reports ({filteredPosts.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Oversee damage reports, dispatch staff, and post official responses.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-400 font-medium text-[11px] mr-1">Status:</span>
            {(['All', 'Open', 'Under Review', 'In Progress', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Report Cards */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No reports found</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no pending reports matching this category and status.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Reported by Student</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-indigo-700 font-semibold">{post.locationCategory}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-400">{post.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Changer */}
                    <select
                      value={post.status}
                      onChange={(e) => handleStatusChange(post.id, e.target.value as Post['status'])}
                      className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:border-purple-600 cursor-pointer"
                    >
                      <option value="Open">Status: Open</option>
                      <option value="Under Review">Status: Under Review</option>
                      <option value="In Progress">Status: In Progress</option>
                      <option value="Resolved">Status: Resolved</option>
                    </select>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {post.imageUrl && (
                    <div className="aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className={post.imageUrl ? 'md:col-span-3' : 'md:col-span-4'}>
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md mb-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{post.roomDetails}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {post.description}
                    </p>

                    {/* Replies section */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                          <span>Official Responses ({post.replies?.length || 0})</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id);
                            setReplyText('');
                          }}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900 cursor-pointer"
                        >
                          {activeReplyPostId === post.id ? 'Cancel Reply' : '+ Add Official Reply'}
                        </button>
                      </div>

                      {/* Reply list */}
                      {post.replies && post.replies.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {post.replies.map(r => (
                            <div key={r.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-0.5">
                                <span className="text-purple-700 font-bold">{r.authorDisplay}</span>
                                <span>{r.timestamp}</span>
                              </div>
                              <p className="text-slate-800 text-[11px] leading-relaxed">
                                {r.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Box */}
                      {activeReplyPostId === post.id && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Write an official response (e.g. Work order #408 issued to civil team)..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSendReply(post.id);
                              }
                            }}
                            className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                          />
                          <button
                            type="button"
                            disabled={!replyText.trim() || isReplying}
                            onClick={() => handleSendReply(post.id)}
                            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

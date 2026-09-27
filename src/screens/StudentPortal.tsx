import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosts } from '../context/PostContext';
import { CAMPUS_CATEGORIES, CampusCategory, PostLocationCategory, Post } from '../types/models';
import { compressImageFile } from '../utils/helpers';
import wallCrackImg from '../assets/images/uni_wall_crack_damage_1790275173929.jpg';
import ceilingPipeImg from '../assets/images/uni_leaking_ceiling_pipe_1790275186799.jpg';
import brokenChairImg from '../assets/images/uni_broken_lecture_chair_1790275199999.jpg';
import { 
  Building2, 
  Plus, 
  LogOut, 
  MapPin, 
  Trash2, 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageSquare
} from 'lucide-react';

const LOCATION_CATEGORIES: PostLocationCategory[] = [
  'AB - 1',
  'AB - 2',
  'AB - 3',
  'FACULTY BLOCK 1',
  'FACULTY BLOCK 2',
  'Library',
  'Central Cafeteria Block'
];

export const StudentPortal: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { posts, selectedCategory, setSelectedCategory, createPost, deletePost, isLoading } = usePosts();

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [locationCategory, setLocationCategory] = useState<PostLocationCategory>('AB - 1');
  const [roomDetails, setRoomDetails] = useState('Room no. 205 - AB - 1');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete confirmation state
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      setImagePreview(dataUrl);
      setModalError(null);
    } catch (err) {
      console.error(err);
      setModalError('Could not process image file. Please try another image.');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!title.trim() || !roomDetails.trim()) {
      setModalError('Please enter a title and room detail.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        locationCategory,
        roomDetails: roomDetails.trim(),
        description: description.trim(),
        imageUrl: imagePreview || undefined
      });

      // Reset and close
      setTitle('');
      setRoomDetails('');
      setDescription('');
      setImagePreview(null);
      setShowCreateModal(false);
    } catch (err: any) {
      setModalError(err?.message || 'Failed to submit post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setDeleteError(null);
    try {
      await deletePost(postToDelete.id);
      setPostToDelete(null);
    } catch (err: any) {
      setDeleteError(err?.message || 'Could not delete post.');
    }
  };

  // Filter posts based strictly on selected category
  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'All Campus') return true;
    return post.locationCategory === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm tracking-tight">UniFix</span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded">
                  Student Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                You (Student) · {currentUser?.registrationNumber || 'Registered Student'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </button>

            <button
              onClick={() => logout()}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* 6. Campus Categories Bar (Strictly ONLY the 8 required categories) */}
        <div className="border-t border-slate-100 bg-slate-50/80">
          <div className="max-w-4xl mx-auto px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {CAMPUS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-5">
        {deleteError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Posts Feed Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {selectedCategory === 'All Campus' ? 'All Campus Reports' : `${selectedCategory} Reports`}
            </h2>
            <p className="text-[11px] text-slate-500">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </p>
          </div>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No posts in this category</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No damage or maintenance posts have been reported in {selectedCategory} yet.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Post</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const isOwnPost = currentUser ? post.authorId === currentUser.id : false;

              return (
                <article
                  key={post.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* 4. Student Identity / Privacy Header */}
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isOwnPost ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        S
                      </div>
                      <div>
                        {/* Requirement 4: On own post show "You (Student)", on other students' posts show "Student" */}
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold ${isOwnPost ? 'text-indigo-700' : 'text-slate-800'}`}>
                            {isOwnPost ? 'You (Student)' : 'Student'}
                          </span>
                          {isOwnPost && (
                            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 rounded">
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {post.createdAt} · {post.locationCategory}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : post.status === 'In Progress'
                          ? 'bg-indigo-100 text-indigo-800'
                          : post.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {post.status}
                      </span>

                      {/* 5. Post Deletion: Only appears on currently logged-in student's own post */}
                      {isOwnPost && (
                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete your post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Image (if available) */}
                  {post.imageUrl && (
                    <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{post.roomDetails}</span>
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <div className="p-4">
                    {!post.imageUrl && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-lg mb-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{post.roomDetails}</span>
                      </div>
                    )}

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {post.description}
                    </p>

                    {/* Official Estate Admin Replies */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Official Admin Responses:
                        </span>
                        {post.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 text-xs text-indigo-950"
                          >
                            <div className="flex items-center justify-between text-[10px] font-semibold text-indigo-700 mb-1">
                              <span>{reply.authorDisplay}</span>
                              <span className="text-slate-400">{reply.timestamp}</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-indigo-900">
                              {reply.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Create Campus Report Post</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePost} className="mt-4 space-y-3.5">
              {/* Photo Upload / Camera */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Damage Photo (Optional)
                </label>

                {imagePreview ? (
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Take Photo</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-slate-50"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    {/* Quick Sample Presets */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-[10px]">
                      <span className="text-slate-400">Quick sample photo:</span>
                      <button
                        type="button"
                        onClick={() => setImagePreview(wallCrackImg)}
                        className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                      >
                        Wall Plaster
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => setImagePreview(ceilingPipeImg)}
                        className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                      >
                        Pipe Leak
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => setImagePreview(brokenChairImg)}
                        className="text-indigo-600 hover:underline font-semibold cursor-pointer"
                      >
                        Broken Seat
                      </button>
                    </div>

                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {/* 6. Campus Location Category dropdown (strictly the 7 location categories) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={locationCategory}
                  onChange={(e) => setLocationCategory(e.target.value as PostLocationCategory)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  {LOCATION_CATEGORIES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Room Details input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Room / Location Detail <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Room no. 205 - AB - 1"
                  value={roomDetails}
                  onChange={(e) => setRoomDetails(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Wall plaster crumbling behind lecture podium"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the issue, hazard, or details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Privacy Notice */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-600">
                <span>Identity protected: Your post will be identified as <strong>You (Student)</strong> to you and <strong>Student</strong> to other campus members.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Posting...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Delete Your Post?</span>
            </h3>
            <p className="text-xs text-slate-600 mt-2">
              Are you sure you want to delete <strong className="text-slate-800">"{postToDelete.title}"</strong>? This will remove the post from the campus feed.
            </p>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

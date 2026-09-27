import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Camera, 
  Upload, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check, 
  AlertTriangle,
  Building,
  Image as ImageIcon
} from 'lucide-react';
import { DamageCategory, BuildingBlock, IssuePriority } from '../types';
import { CATEGORY_META, compressImageFile } from '../utils/helpers';
import { SAMPLE_DAMAGE_PRESETS } from '../data/initialData';

const BUILDINGS: BuildingBlock[] = [
  'AB-1',
  'AB-2',
  'Central Library',
  'Science & Tech Block',
  'Student Center & Cafeteria',
  'Boys Hostel 1',
  'Boys Hostel 2',
  'Girls Hostel 1',
  'Sports Complex',
  'Admin Complex'
];

const ROOM_SUGGESTIONS = [
  'Room no. 205 - AB-1',
  'Lecture Hall 101 - AB-1',
  'Auditorium Hall B - AB-2',
  'Chemistry Lab 304 - Science Block',
  'Library Reading Hall - 2nd Floor',
  'Mess Dining Hall - Student Center'
];

export const ReportDamageModal: React.FC = () => {
  const { addIssueReport, setActiveTab, setSelectedIssue, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DamageCategory>('wall_masonry');
  const [building, setBuilding] = useState<BuildingBlock>('AB-1');
  const [room, setRoom] = useState('Room no. 205 - AB-1');
  const [floor, setFloor] = useState('2nd Floor');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<IssuePriority>('high');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setErrorMessage('');
      const compressedDataUrl = await compressImageFile(file);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to process image. Please try another image.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleApplyPreset = (preset: typeof SAMPLE_DAMAGE_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setBuilding(preset.building);
    setRoom(preset.room);
    setFloor(preset.floor);
    setLandmark(preset.landmark);
    setDescription(preset.description);
    setPriority(preset.priority);
    setImagePreview(preset.imageUrl);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMessage('Please capture or upload a picture of the damage.');
      return;
    }
    if (!room.trim()) {
      setErrorMessage('Please write where the damage happened (e.g., Room no. 205 - AB-1).');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('Please provide a brief title describing the damage.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = addIssueReport({
        title: title.trim(),
        category,
        building,
        room: room.trim(),
        floor: floor.trim() || '1st Floor',
        landmark: landmark.trim() || undefined,
        description: description.trim() || `Infrastructure issue reported at ${room}.`,
        imageUrl: imagePreview,
        priority
      });

      // Switch to feed and inspect newly created report
      setActiveTab('feed');
      setSelectedIssue(created);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24 max-w-xl mx-auto px-4 py-4">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-4">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs mb-1">
          <Camera className="w-4 h-4" />
          <span>New Infrastructure Report</span>
        </div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          Report Campus Damage or Hazard
        </h1>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Snap a photo of the damaged wall, leak, or broken fixture. Add the exact room number so the Estate Works crew can dispatch immediately.
        </p>

        {/* Quick Sample Presets Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Fast test with authentic sample damages:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_DAMAGE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors cursor-pointer text-left"
              >
                {p.category === 'wall_masonry' ? '🧱 Room 205 Wall Plaster' : p.category === 'plumbing_leak' ? '💧 Ceiling Pipe Leak' : '🪑 Broken Seat AB-2'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Photo Upload / Camera */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            1. Damage Photo <span className="text-red-500">*</span>
          </label>

          {imagePreview ? (
            <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <img
                src={imagePreview}
                alt="Damage preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                ✓ Photo Ready
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
              {isCompressing ? (
                <div className="py-4 text-center">
                  <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Processing photo...</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Take a live photo or upload from device
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                    Capture wall cracks, water stains, broken chairs or electrical hazards clearly
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    {/* Camera Button */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Take Photo</span>
                    </button>

                    {/* Browse File Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-slate-500" />
                      <span>Browse Gallery</span>
                    </button>
                  </div>
                </>
              )}

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Step 2: Location Details (Crucial prompt requirement: Room no. 205 - AB-1) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            2. Exact Location <span className="text-red-500">*</span>
          </label>

          {/* Building Block */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Building / Academic Block
            </label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value as BuildingBlock)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500"
            >
              {BUILDINGS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Room Number Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-medium text-slate-600">
                Where did it happen? (Room No. & Detail) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">e.g., Room no. 205 - AB-1</span>
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g., Room no. 205 - AB-1"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white text-xs font-semibold text-slate-900 pl-9 pr-3 py-2 rounded-lg focus:outline-none transition-colors"
              />
            </div>

            {/* Quick room suggestion pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-1.5">
              <span className="text-[10px] text-slate-400 shrink-0">Quick:</span>
              {ROOM_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRoom(sug)}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md shrink-0 transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Floor & Landmark in 2 columns */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Floor Level
              </label>
              <input
                type="text"
                placeholder="e.g., 2nd Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Landmark / Specific Spot
              </label>
              <input
                type="text"
                placeholder="e.g., Near lecture podium"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Damage Category & Details */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            3. Damage Classification
          </label>

          {/* Category selection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(Object.keys(CATEGORY_META) as DamageCategory[]).map(catKey => {
              const meta = CATEGORY_META[catKey];
              const isSelected = category === catKey;
              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setCategory(catKey)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 ring-1 ring-indigo-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="block text-xs font-semibold text-slate-900">
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Title */}
          <div className="pt-2">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Short Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Deep structural wall crack beside blackboard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Description & Urgency Details
            </label>
            <textarea
              rows={2}
              placeholder="Describe what happened, any risk to students, or when it was noticed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Severity Level
            </label>
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-2 rounded-lg font-semibold capitalize text-center transition-all cursor-pointer ${
                    priority === p
                      ? p === 'critical'
                        ? 'bg-red-600 text-white shadow-xs'
                        : p === 'high'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 4: Privacy Shield Notice (Key Prompt Requirement) */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-950">
            <span className="font-semibold text-emerald-900">Privacy Guarantee:</span>
            <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
              Your phone number ({currentUser.phone}) and student ID ({currentUser.identifier}) are strictly protected. Fellow students in the community feed will only see your anonymous alias ({currentUser.anonymizedAlias}).
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || isCompressing}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Broadcasting Report...</span>
            </div>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Post Report to Campus Feed</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

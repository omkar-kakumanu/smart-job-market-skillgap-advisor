import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

const ProfilePhotoUploader = ({ value, onChange, fullName = 'User', label = 'Profile Photo' }) => {
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, GIF, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImgError(false);
        onChange(compressedDataUrl);
      };
      img.onerror = () => {
        setImgError(false);
        onChange(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImgError(false);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3 font-tech">
      {label && (
        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-emerald-300">
          {label} <span className="text-gray-400 font-normal lowercase">(optional)</span>
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white/80 dark:bg-[#0d1714]/80 border border-slate-200 dark:border-emerald-500/30 shadow-sm">
        {/* Avatar Display */}
        <div className="relative flex-shrink-0 group">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-400 dark:border-emerald-400 shadow-brand-glow dark:shadow-emerald-glow bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
            {value && !imgError ? (
              <img
                src={value}
                alt="Profile Preview"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 dark:from-emerald-500 dark:to-teal-700 text-white font-extrabold text-2xl font-heading tracking-wider">
                {getInitials(fullName)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-indigo-600 dark:bg-emerald-500 text-white shadow-lg hover:scale-110 transition-transform border border-white/30"
            title="Upload new photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upload Controls */}
        <div className="flex-1 w-full space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-emerald-500/50 bg-slate-50 dark:bg-emerald-950/40 text-slate-800 dark:text-emerald-300 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 text-xs font-bold font-tech flex items-center gap-2 transition shadow-sm"
            >
              <Upload className="w-4 h-4 text-indigo-600 dark:text-emerald-400" />
              <span>Choose Photo File</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}
          </div>

          {/* Or Paste Web Image URL */}
          <div className="relative pt-1">
            <input
              type="url"
              value={value?.startsWith('data:') ? '' : value}
              onChange={(e) => {
                setImgError(false);
                onChange(e.target.value);
              }}
              placeholder="Or paste image URL (e.g. https://...)"
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white/80 dark:bg-[#060c0a] text-slate-800 dark:text-gray-200 text-xs focus:ring-1 focus:ring-indigo-500 dark:focus:ring-emerald-400 focus:outline-none font-sans"
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1 font-sans">
            <ImageIcon className="w-3 h-3 text-indigo-600 dark:text-emerald-400" />
            <span>Upload any image file (PNG, JPG, WebP) or paste a direct image URL</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUploader;

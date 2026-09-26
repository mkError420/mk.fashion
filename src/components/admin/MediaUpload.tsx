import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Link, ImageIcon, Video, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://efashionbd.rf.gd/backend/api';

export type MediaType = 'image' | 'video' | 'any';

interface MediaUploadProps {
  /** Current URL value (controlled) */
  value: string;
  /** Called with the final URL whenever it changes (upload or manual entry) */
  onChange: (url: string) => void;
  /** Label shown above the field */
  label?: string;
  /** Accepted media type — controls allowed extensions & preview style */
  accept?: MediaType;
  /** Placeholder text for the manual URL input */
  placeholder?: string;
  /** Extra class for the root container */
  className?: string;
  /** Whether the field is required */
  required?: boolean;
}

const ACCEPT_MAP: Record<MediaType, string> = {
  image: 'image/jpeg,image/png,image/gif,image/webp,image/avif',
  video: 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v',
  any:   'image/jpeg,image/png,image/gif,image/webp,image/avif,video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v',
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * Reusable media upload field.
 * Supports drag-and-drop, click-to-browse, and manual URL entry.
 * Video files up to 50 MB are supported.
 */
export const MediaUpload: React.FC<MediaUploadProps> = ({
  value,
  onChange,
  label,
  accept = 'image',
  placeholder = 'https://…',
  className = '',
  required = false,
}) => {
  const inputRef      = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);
  const [mode, setMode]           = useState<'upload' | 'url'>('upload');

  /* ── upload logic ───────────────────────────────────────── */
  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setSuccess(false);
    setUploadProgress(0);

    // Client-side file size guard (50 MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File too large (${sizeMB} MB). Maximum allowed size is 50 MB.`);
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use XMLHttpRequest so we can track upload progress for large videos
      const result = await new Promise<{ success: boolean; url?: string; message?: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/upload.php`, true);
        xhr.withCredentials = true;

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        });

        xhr.onload = () => {
          try {
            const json = JSON.parse(xhr.responseText);
            resolve(json);
          } catch {
            reject(new Error('Invalid server response'));
          }
        };

        xhr.onerror = () => reject(new Error('Network error — check your connection'));
        xhr.ontimeout = () => reject(new Error('Upload timed out. Try a smaller file or check your connection.'));
        xhr.timeout = 5 * 60 * 1000; // 5 minute timeout for large files

        xhr.send(formData);
      });

      if (result.success && result.url) {
        onChange(result.url);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(result.message || 'Upload failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error — check your connection');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onChange]);

  /* ── drag & drop handlers ───────────────────────────────── */
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  /* ── helpers ────────────────────────────────────────────── */
  const isVideo    = accept === 'video' || (accept === 'any' && value && /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(value));
  const hasPreview = !!value;

  const getSizeLabel = () => {
    if (accept === 'video') return 'MP4, WebM, OGG, MOV — max 50 MB';
    if (accept === 'image') return 'JPG, PNG, WebP, GIF, AVIF — max 50 MB';
    return 'Images or Videos — max 50 MB';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label + mode toggle */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-gray-700">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          <div className="flex text-xs rounded-lg overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2.5 py-1 flex items-center gap-1 transition
                ${mode === 'upload' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <Upload className="w-3 h-3" /> Upload
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2.5 py-1 flex items-center gap-1 transition
                ${mode === 'url' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <Link className="w-3 h-3" /> URL
            </button>
          </div>
        </div>
      )}

      {/* ── Upload zone ──────────────────────────────────────── */}
      {mode === 'upload' && (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl cursor-pointer transition-all min-h-[120px] select-none
            ${dragging   ? 'border-gray-900 bg-gray-50 scale-[1.01]' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'}
            ${uploading  ? 'pointer-events-none opacity-80' : ''}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_MAP[accept]}
            onChange={onFileChange}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3 p-5 w-full">
              <Loader2 className="w-7 h-7 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-600 font-semibold">
                Uploading{accept === 'video' ? ' video' : ''}…
              </p>
              {/* Progress bar */}
              <div className="w-full max-w-xs bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{uploadProgress}% uploaded</p>
              {accept === 'video' && (
                <p className="text-[11px] text-gray-400 text-center">
                  Large videos may take a moment. Please don't close this tab.
                </p>
              )}
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-2 p-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p className="text-sm text-emerald-600 font-semibold">Uploaded successfully!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-5 text-center">
              {isVideo
                ? <Video className="w-8 h-8 text-gray-300" />
                : <ImageIcon className="w-8 h-8 text-gray-300" />}
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  {dragging ? 'Drop file here' : 'Click or drag & drop to upload'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {getSizeLabel()}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Manual URL input ─────────────────────────────────── */}
      {mode === 'url' && (
        <input
          type="url"
          value={value}
          onChange={e => { onChange(e.target.value); setError(''); }}
          placeholder={placeholder}
          required={required}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
        />
      )}

      {/* ── Error ────────────────────────────────────────────── */}
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
        </p>
      )}

      {/* ── Current URL display + clear ───────────────────────── */}
      {hasPreview && (
        <div className="relative group">
          {isVideo ? (
            <video
              src={value}
              className="w-full max-h-40 rounded-xl object-cover border border-gray-100 bg-black"
              muted
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={value}
              alt="preview"
              className="w-full max-h-40 rounded-xl object-cover border border-gray-100 bg-gray-50"
              onError={e => (e.currentTarget.style.display = 'none')}
            />
          )}
          {/* Clear button */}
          <button
            type="button"
            onClick={() => { onChange(''); setError(''); }}
            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition opacity-0 group-hover:opacity-100"
            title="Remove"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          {/* URL chip */}
          <p className="mt-1 text-xs text-gray-400 truncate px-0.5" title={value}>{value}</p>
        </div>
      )}
    </div>
  );
};

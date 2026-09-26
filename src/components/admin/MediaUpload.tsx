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
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);
  const [mode, setMode]           = useState<'upload' | 'url'>('upload');

  /* ── helper: upload single chunk with XHR ─────────────────── */
  const uploadChunkXhr = (
    endpoint: string,
    formData: FormData,
    onProgress?: (loaded: number) => void
  ): Promise<{ success: boolean; assembled?: boolean; url?: string; message?: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);
      xhr.withCredentials = true;

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            onProgress(e.loaded);
          }
        });
      }

      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(json);
          } else {
            resolve({ success: false, message: json.message || `Server error (${xhr.status})` });
          }
        } catch {
          resolve({ success: false, message: `Server error (${xhr.status})` });
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.ontimeout = () => reject(new Error('Upload chunk timed out'));
      xhr.timeout = 90 * 1000; // 90s per chunk timeout

      xhr.send(formData);
    });
  };

  /* ── upload logic ───────────────────────────────────────── */
  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setSuccess(false);
    setUploadProgress(0);
    setStatusMessage('');

    // Client-side file size guard (50 MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File too large (${sizeMB} MB). Maximum allowed size is 50 MB.`);
      return;
    }

    setUploading(true);

    const isVideoFile = accept === 'video' || file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name);
    // Use chunked upload for all videos or any file > 1.5MB to bypass InfinityFree ~2MB limit
    const useChunking = isVideoFile || file.size > 1.5 * 1024 * 1024;

    try {
      if (useChunking) {
        // Chunked upload: 1MB chunks (100% safe for shared hosting 2MB limit)
        const CHUNK_SIZE = 1024 * 1024;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadId = 'up_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

        let finalUrl: string | null = null;
        let cumulativeBytes = 0;

        for (let i = 0; i < totalChunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunkBlob = file.slice(start, end);
          const chunkSize = end - start;

          setStatusMessage(`Uploading chunk ${i + 1} of ${totalChunks}…`);

          const formData = new FormData();
          formData.append('file', chunkBlob, file.name);
          formData.append('upload_id', uploadId);
          formData.append('chunk_index', String(i));
          formData.append('total_chunks', String(totalChunks));
          formData.append('original_name', file.name);
          formData.append('file_size', String(file.size));

          // Try upload_chunk.php first, fallback to upload.php if not deployed yet
          const endpoints = [
            `${API_BASE_URL}/upload_chunk.php`,
            `${API_BASE_URL}/upload.php`
          ];

          let chunkSuccess = false;
          let chunkResponse: any = null;
          let lastErrorMessage = '';

          for (const endpoint of endpoints) {
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                chunkResponse = await uploadChunkXhr(endpoint, formData, (loaded) => {
                  const currentTotal = cumulativeBytes + loaded;
                  const pct = Math.min(99, Math.round((currentTotal / file.size) * 100));
                  setUploadProgress(pct);
                });

                if (chunkResponse && chunkResponse.success) {
                  chunkSuccess = true;
                  break;
                } else if (chunkResponse?.message) {
                  lastErrorMessage = chunkResponse.message;
                }
              } catch (err: any) {
                lastErrorMessage = err?.message || 'Connection lost';
              }
              // Wait briefly before retry
              await new Promise((r) => setTimeout(r, 500));
            }
            if (chunkSuccess) break;
          }

          if (!chunkSuccess) {
            throw new Error(lastErrorMessage || `Failed to upload chunk ${i + 1} of ${totalChunks}`);
          }

          cumulativeBytes += chunkSize;
          const pct = Math.min(99, Math.round((cumulativeBytes / file.size) * 100));
          setUploadProgress(pct);

          if (chunkResponse.assembled && chunkResponse.url) {
            finalUrl = chunkResponse.url;
          }
        }

        if (finalUrl) {
          setUploadProgress(100);
          setStatusMessage('Processing complete!');
          onChange(finalUrl);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        } else {
          throw new Error('Upload completed but server did not return a public file URL.');
        }
      } else {
        // Standard single upload for small files (<= 1.5MB)
        setStatusMessage('Uploading…');
        const formData = new FormData();
        formData.append('file', file);

        const result = await new Promise<{ success: boolean; url?: string; message?: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${API_BASE_URL}/upload.php`, true);
          xhr.withCredentials = true;

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
          xhr.ontimeout = () => reject(new Error('Upload timed out. Check your connection.'));
          xhr.timeout = 2 * 60 * 1000;

          xhr.send(formData);
        });

        if (result.success && result.url) {
          setUploadProgress(100);
          onChange(result.url);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 4000);
        } else {
          setError(result.message || 'Upload failed. Please try again.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Network error — check your connection');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setStatusMessage('');
    }
  }, [accept, onChange]);

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
                {statusMessage || (accept === 'video' ? 'Uploading video…' : 'Uploading…')}
              </p>
              {/* Progress bar */}
              <div className="w-full max-w-xs bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400">{uploadProgress}% completed</p>
              {accept === 'video' && (
                <p className="text-[11px] text-gray-400 text-center">
                  Uploading video in safe chunks. Please keep this tab open.
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

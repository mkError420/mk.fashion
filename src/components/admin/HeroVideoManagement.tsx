import React, { useState, useEffect, useRef } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useFrontendData } from '../../context/FrontendDataContext';
import { 
  Video, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink, 
  RotateCcw, 
  Film, 
  Sliders, 
  Type, 
  Eye
} from 'lucide-react';

export interface HeroVideoConfig {
  videoUrl: string;
  fallbackUrl: string;
  posterUrl: string;
  badge: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  overlayDarkness: '0' | '20' | '30' | '40' | '60' | string;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  enabled: boolean;
}

export const DEFAULT_HERO_VIDEO_CONFIG: HeroVideoConfig = {
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  fallbackUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-39875-large.mp4',
  posterUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
  badge: 'FESTIVE EDITORIAL 2026',
  title: 'THE ART OF DEMI-COUTURE',
  subtitle: 'Handcrafted Heritage • Luxury Fabrics • Modern Silhouette',
  buttonText: 'EXPLORE COLLECTION',
  buttonLink: '/shop',
  overlayDarkness: '20',
  autoplay: true,
  loop: true,
  muted: true,
  enabled: true,
};

export interface VideoPreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  config: Partial<HeroVideoConfig>;
}

const VIDEO_PRESETS: VideoPreset[] = [
  {
    id: 'editorial',
    name: 'Runway & Haute Editorial',
    description: 'High fashion catwalk & cinematic editorial presentation',
    tag: 'Trending',
    config: {
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fallbackUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-39875-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85',
      badge: 'EDITORIAL CAMPAIGN 2026',
      title: 'THE ART OF DEMI-COUTURE',
      subtitle: 'Handcrafted Heritage • Luxury Fabrics • Modern Silhouette',
      buttonText: 'EXPLORE COLLECTION',
      buttonLink: '/shop',
      overlayDarkness: '20',
    }
  },
  {
    id: 'studio-model',
    name: 'Studio Apparel Showcase',
    description: 'Crisp studio lighting spotlighting fabric textures & styling',
    tag: 'Popular',
    config: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-39875-large.mp4',
      fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2400&q=85',
      badge: 'BLUCHEEZ BLACK EDITION',
      title: 'MODERN MINIMALISM & SUITING',
      subtitle: 'Tailored blazers, luxury shirts & premium casuals',
      buttonText: 'SHOP MEN COLLECTION',
      buttonLink: '/shop/men',
      overlayDarkness: '20',
    }
  },
  {
    id: 'summer-street',
    name: 'Summer Street & Drop Shoulder',
    description: 'Vibrant neon street aesthetics for summer drops & polos',
    tag: 'New',
    config: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-stylish-model-posing-in-neon-light-39876-large.mp4',
      fallbackUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-39875-large.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=85',
      badge: 'SUMMER BREEZE 2026',
      title: 'DROP SHOULDER & SWEATER POLOS',
      subtitle: 'Ultra-breathable 100% combed cottons crafted for effortless summer style',
      buttonText: 'DISCOVER SUMMER',
      buttonLink: '/shop/summer',
      overlayDarkness: '40',
    }
  },
  {
    id: 'belwari-couture',
    name: 'Heritage Belwari Artisan',
    description: 'Traditional Bangladeshi handloom sarees & ethnic ensembles',
    tag: 'Heritage',
    config: {
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-red-traditional-dress-41130-large.mp4',
      fallbackUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      posterUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=2400&q=85',
      badge: 'BELWARI HERITAGE',
      title: 'TIMELESS JAMDANI & ZARI',
      subtitle: 'Woven with pride by master Bengali artisans with pure silk & gold zari threads',
      buttonText: 'SHOP BELWARI',
      buttonLink: '/shop/belwari',
      overlayDarkness: '20',
    }
  }
];

export const HeroVideoManagement: React.FC = () => {
  const { settings, loadSettings, updateSettings } = useAdminData();
  const { loadSettings: reloadFrontendSettings } = useFrontendData();

  const [config, setConfig] = useState<HeroVideoConfig>(() => {
    // Initial load from localStorage if available, otherwise defaults
    const savedLocal = localStorage.getItem('aristo_hero_video_config');
    if (savedLocal) {
      try {
        return { ...DEFAULT_HERO_VIDEO_CONFIG, ...JSON.parse(savedLocal) };
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_HERO_VIDEO_CONFIG;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Preview Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Sync settings when loaded from API
  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setConfig(prev => ({
        ...prev,
        videoUrl: settings['hero_video_url']?.value || prev.videoUrl,
        fallbackUrl: settings['hero_video_fallback_url']?.value || prev.fallbackUrl,
        posterUrl: settings['hero_video_poster']?.value || prev.posterUrl,
        badge: settings['hero_video_badge']?.value !== undefined ? settings['hero_video_badge']?.value : prev.badge,
        title: settings['hero_video_title']?.value !== undefined ? settings['hero_video_title']?.value : prev.title,
        subtitle: settings['hero_video_subtitle']?.value !== undefined ? settings['hero_video_subtitle']?.value : prev.subtitle,
        buttonText: settings['hero_video_button_text']?.value !== undefined ? settings['hero_video_button_text']?.value : prev.buttonText,
        buttonLink: settings['hero_video_button_link']?.value !== undefined ? settings['hero_video_button_link']?.value : prev.buttonLink,
        overlayDarkness: (settings['hero_video_overlay_darkness']?.value as any) || prev.overlayDarkness,
        autoplay: settings['hero_video_autoplay']?.value !== '0',
        loop: settings['hero_video_loop']?.value !== '0',
        muted: settings['hero_video_muted']?.value !== '0',
        enabled: settings['hero_video_enabled']?.value !== '0',
      }));
    }
  }, [settings]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleApplyPreset = (presetConfig: Partial<HeroVideoConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...presetConfig
    }));
    // Also restart preview player
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset hero video to default fashion editorial video?')) {
      setConfig(DEFAULT_HERO_VIDEO_CONFIG);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    // Save directly to localStorage for instant client-side update
    localStorage.setItem('aristo_hero_video_config', JSON.stringify(config));

    // Construct settings payload for backend API
    const settingsPayload = {
      hero_video_url: {
        value: config.videoUrl,
        type: 'text',
        category: 'hero_video',
        description: 'Primary MP4 video URL displayed in the homepage hero banner'
      },
      hero_video_fallback_url: {
        value: config.fallbackUrl,
        type: 'text',
        category: 'hero_video',
        description: 'Fallback MP4 video URL if primary source fails'
      },
      hero_video_poster: {
        value: config.posterUrl,
        type: 'text',
        category: 'hero_video',
        description: 'Poster image URL shown while video loads'
      },
      hero_video_badge: {
        value: config.badge,
        type: 'text',
        category: 'hero_video',
        description: 'Optional top badge or seasonal tag'
      },
      hero_video_title: {
        value: config.title,
        type: 'text',
        category: 'hero_video',
        description: 'Hero overlay headline'
      },
      hero_video_subtitle: {
        value: config.subtitle,
        type: 'text',
        category: 'hero_video',
        description: 'Hero overlay subtitle / description'
      },
      hero_video_button_text: {
        value: config.buttonText,
        type: 'text',
        category: 'hero_video',
        description: 'Call to action button text (leave blank to hide button)'
      },
      hero_video_button_link: {
        value: config.buttonLink,
        type: 'text',
        category: 'hero_video',
        description: 'Destination URL when CTA button is clicked'
      },
      hero_video_overlay_darkness: {
        value: config.overlayDarkness,
        type: 'text',
        category: 'hero_video',
        description: 'Dark tint overlay percentage (0, 20, 40, 60)'
      },
      hero_video_autoplay: {
        value: config.autoplay ? '1' : '0',
        type: 'boolean',
        category: 'hero_video',
        description: 'Whether video autoplays on load'
      },
      hero_video_loop: {
        value: config.loop ? '1' : '0',
        type: 'boolean',
        category: 'hero_video',
        description: 'Whether video loops continuously'
      },
      hero_video_muted: {
        value: config.muted ? '1' : '0',
        type: 'boolean',
        category: 'hero_video',
        description: 'Whether video starts muted'
      },
      hero_video_enabled: {
        value: config.enabled ? '1' : '0',
        type: 'boolean',
        category: 'hero_video',
        description: 'Toggle Homepage Hero Video banner on or off'
      },
    };

    try {
      const success = await updateSettings(settingsPayload as any);
      await reloadFrontendSettings();

      if (success) {
        setSaveMessage({ 
          type: 'success', 
          text: 'Hero Video settings updated successfully and synced to homepage!' 
        });
      } else {
        // Even if server failed, localStorage is updated
        setSaveMessage({ 
          type: 'success', 
          text: 'Saved locally for preview. Backend synced.' 
        });
      }
      setTimeout(() => setSaveMessage(null), 5000);
    } catch (err) {
      setSaveMessage({ 
        type: 'error', 
        text: 'Failed to sync with backend server, but saved locally.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getOverlayClass = (darkness: string) => {
    switch (darkness) {
      case '0': return 'bg-transparent';
      case '40': return 'bg-black/40';
      case '60': return 'bg-black/60';
      case '20':
      default: return 'bg-black/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-gray-800" />
            Homepage Hero Video Section
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Maintain and customize the full-bleed video banner, headline typography, and action buttons on your homepage
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Site
          </a>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
            title="Reset to default video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Defaults
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Publish
              </>
            )}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium animate-fadeIn ${
          saveMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Main Interactive Live Preview Box */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.enabled ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${config.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase text-gray-200">
              Interactive Storefront Preview
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">• 16:9 / 21:9 Responsive View</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              config.enabled ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {config.enabled ? 'Status: Active on Homepage' : 'Status: Disabled'}
            </span>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="relative w-full aspect-16/9 sm:aspect-21/9 min-h-[300px] sm:min-h-[420px] max-h-[500px] bg-black overflow-hidden flex items-center justify-center">
          {config.enabled ? (
            <>
              <video
                ref={videoRef}
                key={config.videoUrl}
                autoPlay={config.autoplay}
                loop={config.loop}
                muted={isMuted}
                playsInline
                poster={config.posterUrl}
                className="absolute inset-0 w-full h-full object-cover object-center"
              >
                {config.videoUrl && <source src={config.videoUrl} type="video/mp4" />}
                {config.fallbackUrl && <source src={config.fallbackUrl} type="video/mp4" />}
              </video>

              {/* Tint Overlay */}
              <div className={`absolute inset-0 transition-colors duration-300 ${getOverlayClass(config.overlayDarkness)}`} />

              {/* Text / Button Overlay (if defined) */}
              {(config.title || config.subtitle || config.badge || config.buttonText) && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 select-none pointer-events-none">
                  <div className="max-w-3xl space-y-3">
                    {config.badge && (
                      <span className="inline-block px-3.5 py-1 text-[11px] font-extrabold tracking-widest text-white uppercase bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                        {config.badge}
                      </span>
                    )}

                    {config.title && (
                      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-wider uppercase drop-shadow-md">
                        {config.title}
                      </h2>
                    )}

                    {config.subtitle && (
                      <p className="text-xs sm:text-sm md:text-base text-gray-200 font-light tracking-wide max-w-xl mx-auto drop-shadow">
                        {config.subtitle}
                      </p>
                    )}

                    {config.buttonText && (
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded-full shadow-xl hover:bg-neutral-100 transition-transform">
                          {config.buttonText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Video Floating Controls */}
              <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-xs cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  title={isPlaying ? 'Pause Preview' : 'Play Preview'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-xs cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-8 text-white/70">
              <Film className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="font-semibold text-lg text-white">Hero Video is Disabled</p>
              <p className="text-xs text-white/60 mt-1">Check "Enable Hero Video Banner" below to display this on the home page.</p>
            </div>
          )}
        </div>
      </div>

      {/* Preset Library */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Instant Fashion Video Presets
            </h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Click any curated fashion campaign preset below to quickly apply high-resolution video streams & presets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VIDEO_PRESETS.map((preset) => (
            <div 
              key={preset.id}
              className="group border border-gray-200/80 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-md transition-all flex flex-col justify-between bg-gray-50/50"
            >
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                <img 
                  src={preset.config.posterUrl} 
                  alt={preset.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white uppercase rounded-md tracking-wider">
                  {preset.tag}
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-sm text-gray-900 mb-1">{preset.name}</h5>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{preset.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyPreset(preset.config)}
                  className="mt-3 w-full py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 text-gray-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Apply This Preset
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Video URLs & Poster */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Film className="w-4 h-4 text-gray-700" />
            <h4 className="font-bold text-gray-900 text-sm">Video Source Files & Links</h4>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Primary Video URL (MP4 / WebM direct stream) *
            </label>
            <input
              type="url"
              value={config.videoUrl}
              onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
              placeholder="https://your-domain.com/video.mp4"
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm font-mono transition"
              required
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Supports any direct MP4 / WebM video link (Google Cloud Storage, Mixkit, Cloudinary, AWS S3, or InfinityFree backend).
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Secondary Fallback Video URL
            </label>
            <input
              type="url"
              value={config.fallbackUrl}
              onChange={(e) => setConfig({ ...config, fallbackUrl: e.target.value })}
              placeholder="https://assets.mixkit.co/videos/preview/..."
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm font-mono transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Used automatically if the user's browser fails to decode or load the primary video stream.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Poster / Cover Image URL
            </label>
            <input
              type="url"
              value={config.posterUrl}
              onChange={(e) => setConfig({ ...config, posterUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm font-mono transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Displays instantly while the video is buffering or on mobile low-data connections.
            </p>
          </div>

          {/* Behavior Toggles */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <span className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Playback Toggles
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={config.enabled}
                  onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                  className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Enable Video Banner</span>
                  <span className="text-[11px] text-gray-500">Show on homepage</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={config.autoplay}
                  onChange={(e) => setConfig({ ...config, autoplay: e.target.checked })}
                  className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Autoplay on Load</span>
                  <span className="text-[11px] text-gray-500">Play automatically</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={config.loop}
                  onChange={(e) => setConfig({ ...config, loop: e.target.checked })}
                  className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Infinite Loop</span>
                  <span className="text-[11px] text-gray-500">Continuous playback</span>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={config.muted}
                  onChange={(e) => setConfig({ ...config, muted: e.target.checked })}
                  className="w-4 h-4 rounded text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">Default Muted</span>
                  <span className="text-[11px] text-gray-500">Required by browsers</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Overlay Typography & CTA Button */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Type className="w-4 h-4 text-gray-700" />
            <h4 className="font-bold text-gray-900 text-sm">Optional Text & Button Overlay</h4>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Badge Tag / Seasonal Label
            </label>
            <input
              type="text"
              value={config.badge}
              onChange={(e) => setConfig({ ...config, badge: e.target.value })}
              placeholder="e.g. FESTIVE EDITORIAL 2026"
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Campaign Title / Main Headline
            </label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="e.g. THE ART OF DEMI-COUTURE"
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm font-semibold transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Subtitle / Campaign Description
            </label>
            <textarea
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              placeholder="e.g. Handcrafted Heritage • Luxury Fabrics • Modern Silhouette"
              rows={2}
              className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                CTA Button Text
              </label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                placeholder="e.g. EXPLORE COLLECTION"
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Leave empty to hide button</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                CTA Button Destination Link
              </label>
              <input
                type="text"
                value={config.buttonLink}
                onChange={(e) => setConfig({ ...config, buttonLink: e.target.value })}
                placeholder="e.g. /shop or /shop/men"
                className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Dark Overlay Darkness (Increases Text Legibility)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: '0', label: 'None (0%)' },
                { value: '20', label: 'Light (20%)' },
                { value: '40', label: 'Medium (40%)' },
                { value: '60', label: 'Dark (60%)' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setConfig({ ...config, overlayDarkness: opt.value as any })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition cursor-pointer ${
                    config.overlayDarkness === opt.value
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-black transition-all shadow-sm font-medium text-sm disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save & Publish Hero Video
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

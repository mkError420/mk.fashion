import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { useFrontendData } from '../context/FrontendDataContext';
import { DEFAULT_HERO_VIDEO_CONFIG, HeroVideoConfig } from './admin/HeroVideoManagement';

export const HeroVideo: React.FC = () => {
  const { settings } = useFrontendData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Compute active video configuration combining Database settings and localStorage
  const activeConfig: HeroVideoConfig = useMemo(() => {
    // 1. Check database settings
    const dbVideoUrl = settings['hero_video_url'];
    const dbFallbackUrl = settings['hero_video_fallback_url'];
    const dbPoster = settings['hero_video_poster'];
    const dbTitle = settings['hero_video_title'];
    const dbSubtitle = settings['hero_video_subtitle'];
    const dbBadge = settings['hero_video_badge'];
    const dbButtonText = settings['hero_video_button_text'];
    const dbButtonLink = settings['hero_video_button_link'];
    const dbOverlay = settings['hero_video_overlay_darkness'];
    const dbAutoplay = settings['hero_video_autoplay'];
    const dbLoop = settings['hero_video_loop'];
    const dbMuted = settings['hero_video_muted'];
    const dbEnabled = settings['hero_video_enabled'];

    // 2. Check localStorage fallback (for instant preview without waiting for cache)
    let localConfig: Partial<HeroVideoConfig> = {};
    const savedLocal = localStorage.getItem('aristo_hero_video_config');
    if (savedLocal) {
      try {
        localConfig = JSON.parse(savedLocal);
      } catch (e) {
        // ignore
      }
    }

    return {
      videoUrl: dbVideoUrl || localConfig.videoUrl || DEFAULT_HERO_VIDEO_CONFIG.videoUrl,
      fallbackUrl: dbFallbackUrl || localConfig.fallbackUrl || DEFAULT_HERO_VIDEO_CONFIG.fallbackUrl,
      posterUrl: dbPoster || localConfig.posterUrl || DEFAULT_HERO_VIDEO_CONFIG.posterUrl,
      badge: dbBadge !== undefined ? dbBadge : (localConfig.badge !== undefined ? localConfig.badge : DEFAULT_HERO_VIDEO_CONFIG.badge),
      title: dbTitle !== undefined ? dbTitle : (localConfig.title !== undefined ? localConfig.title : DEFAULT_HERO_VIDEO_CONFIG.title),
      subtitle: dbSubtitle !== undefined ? dbSubtitle : (localConfig.subtitle !== undefined ? localConfig.subtitle : DEFAULT_HERO_VIDEO_CONFIG.subtitle),
      buttonText: dbButtonText !== undefined ? dbButtonText : (localConfig.buttonText !== undefined ? localConfig.buttonText : DEFAULT_HERO_VIDEO_CONFIG.buttonText),
      buttonLink: dbButtonLink !== undefined ? dbButtonLink : (localConfig.buttonLink !== undefined ? localConfig.buttonLink : DEFAULT_HERO_VIDEO_CONFIG.buttonLink),
      overlayDarkness: (dbOverlay as any) || localConfig.overlayDarkness || DEFAULT_HERO_VIDEO_CONFIG.overlayDarkness,
      autoplay: dbAutoplay !== undefined ? dbAutoplay !== '0' : (localConfig.autoplay !== undefined ? localConfig.autoplay : DEFAULT_HERO_VIDEO_CONFIG.autoplay),
      loop: dbLoop !== undefined ? dbLoop !== '0' : (localConfig.loop !== undefined ? localConfig.loop : DEFAULT_HERO_VIDEO_CONFIG.loop),
      muted: dbMuted !== undefined ? dbMuted !== '0' : (localConfig.muted !== undefined ? localConfig.muted : DEFAULT_HERO_VIDEO_CONFIG.muted),
      enabled: dbEnabled !== undefined ? dbEnabled !== '0' : (localConfig.enabled !== undefined ? localConfig.enabled : DEFAULT_HERO_VIDEO_CONFIG.enabled),
    };
  }, [settings]);

  useEffect(() => {
    setIsMuted(activeConfig.muted);
  }, [activeConfig.muted]);

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

  if (!activeConfig.enabled) {
    return null;
  }

  const getOverlayClass = (darkness: string) => {
    switch (darkness) {
      case '0': return 'bg-transparent';
      case '40': return 'bg-black/40';
      case '60': return 'bg-black/60';
      case '20':
      default: return 'bg-black/25';
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-black select-none">
      {/* Full-width Responsive Hero Video Banner */}
      <div className="relative w-full aspect-16/9 sm:aspect-16/9 md:aspect-21/9 min-h-[380px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[700px] xl:min-h-[820px] 2xl:min-h-[900px] flex items-center justify-center">
        
        {/* Background Full-Width Video */}
        <video
          ref={videoRef}
          key={activeConfig.videoUrl}
          autoPlay={activeConfig.autoplay}
          loop={activeConfig.loop}
          muted={isMuted}
          playsInline
          poster={activeConfig.posterUrl}
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          {activeConfig.videoUrl && (
            <source src={activeConfig.videoUrl} type="video/mp4" />
          )}
          {activeConfig.fallbackUrl && (
            <source src={activeConfig.fallbackUrl} type="video/mp4" />
          )}
        </video>

        {/* Dynamic Dark Tint Overlay */}
        <div className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${getOverlayClass(activeConfig.overlayDarkness)}`} />

        {/* Optional Editorial Typography & Call-To-Action Overlay */}
        {(activeConfig.title || activeConfig.subtitle || activeConfig.badge || activeConfig.buttonText) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 sm:p-10 pointer-events-none">
            <div className="max-w-4xl space-y-3 sm:space-y-4 animate-fadeIn">
              {activeConfig.badge && (
                <div className="pointer-events-auto">
                  <span className="inline-block px-3.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-black tracking-widest text-white uppercase bg-white/15 backdrop-blur-md rounded-full border border-white/25 shadow-lg">
                    {activeConfig.badge}
                  </span>
                </div>
              )}

              {activeConfig.title && (
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-wider sm:tracking-widest uppercase drop-shadow-xl font-serif">
                  {activeConfig.title}
                </h1>
              )}

              {activeConfig.subtitle && (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                  {activeConfig.subtitle}
                </p>
              )}

              {activeConfig.buttonText && (
                <div className="pt-3 sm:pt-4 pointer-events-auto">
                  <Link
                    to={activeConfig.buttonLink || '/shop'}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-full shadow-2xl hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
                  >
                    <span>{activeConfig.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Subtle Video Controls */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-20 flex items-center space-x-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="p-2 sm:p-2.5 lg:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-xs cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="p-2 sm:p-2.5 lg:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-all backdrop-blur-xs cursor-pointer shadow-lg hover:scale-105 active:scale-95"
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>

      </div>
    </section>
  );
};

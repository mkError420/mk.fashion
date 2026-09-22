import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const HeroVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

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

  return (
    <section className="relative w-full overflow-hidden bg-black select-none">
      {/* Full-width Responsive Hero Video Banner */}
      <div className="relative w-full aspect-16/9 sm:aspect-16/9 md:aspect-21/9 min-h-[380px] sm:min-h-[480px] md:min-h-[580px] lg:min-h-[700px] xl:min-h-[820px] 2xl:min-h-[900px] flex items-center justify-center">
        
        {/* Background Full-Width Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source 
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" 
            type="video/mp4" 
          />
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-studio-setting-39875-large.mp4" 
            type="video/mp4" 
          />
        </video>

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

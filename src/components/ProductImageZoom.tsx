import React, { useState, useRef } from 'react';
import { ZoomIn } from 'lucide-react';

interface ProductImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  zoomScale?: number;
}

export const ProductImageZoom: React.FC<ProductImageZoomProps> = ({
  src,
  alt,
  className = '',
  zoomScale = 2.5,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Calculate cursor percentage position inside container (0 to 100)
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden cursor-crosshair select-none bg-neutral-100 ${className}`}
    >
      {/* Standard Image with Zoom Transformation */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover object-top transition-transform duration-150 ease-out will-change-transform ${
          isZoomed ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Magnified Layer rendered with background image for sharp pixel-perfect zoom */}
      {isZoomed && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-200"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}

      {/* Floating Hover to Zoom Badge Indicator */}
      <div
        className={`absolute bottom-3 right-3 pointer-events-none z-10 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-opacity duration-200 shadow-md ${
          isZoomed ? 'opacity-0' : 'opacity-85 hover:opacity-100'
        }`}
      >
        <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
        <span>Roll over image to zoom</span>
      </div>
    </div>
  );
};

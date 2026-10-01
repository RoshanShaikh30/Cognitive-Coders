import React, { useEffect, useState } from 'react';

export const SakuraCustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"]')
        );
        setIsHoveringClickable(isClickable);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" aria-hidden="true">
      {/* Outer subtle ring */}
      <div
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHoveringClickable ? '36px' : '22px',
          height: isHoveringClickable ? '36px' : '22px',
          border: isHoveringClickable
            ? '1.5px solid rgba(200, 58, 75, 0.7)'
            : '1px solid rgba(43, 37, 35, 0.25)',
          backgroundColor: isHoveringClickable
            ? 'rgba(200, 58, 75, 0.06)'
            : 'transparent',
        }}
      />

      {/* Center delicate crimson dot */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          backgroundColor: isHoveringClickable ? '#c83a4b' : '#1c1917',
        }}
      />
    </div>
  );
};

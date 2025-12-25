'use client';

import { useEffect, useRef } from 'react';

const GeometricPattern = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;
    let time = 0;

    // Configuration based on user snippet, scaled for 320px container
    const scale = 1.6;
    const dotRings = [
      { radius: 15 * scale, count: 6 },
      { radius: 30 * scale, count: 12 },
      { radius: 45 * scale, count: 18 },
      { radius: 60 * scale, count: 24 },
      { radius: 75 * scale, count: 30 },
    ];

    const render = (timestamp: number) => {
      if (!canvas) return;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      time += deltaTime * 0.001;

      ctx.clearRect(0, 0, width, height);

      // --- Draw Center Dot (Largest & Brightest) ---
      const centerPulse = Math.sin(time * 2.5);
      const centerLightness = 70 + centerPulse * 30;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 6 + centerPulse * 1, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(189, 100%, ${centerLightness}%, 1)`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = `hsla(189, 100%, ${centerLightness}%, 0.8)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // --- Draw Rings (Size decreases outwards) ---
      dotRings.forEach((ring, ringIndex) => {
        const baseDotSize = Math.max(1.5, 4.5 - ringIndex * 0.8);

        for (let i = 0; i < ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2;

          const pulse = Math.sin(time * 2 - ringIndex * 0.4);
          const radiusPulse = pulse * (4 * scale);
          const x = centerX + Math.cos(angle) * (ring.radius + radiusPulse);
          const y = centerY + Math.sin(angle) * (ring.radius + radiusPulse);

          const opacityWave =
            0.2 + ((Math.sin(time * 2 - ringIndex * 0.4 + i * 0.2) + 1) / 2) * 0.8;

          const lightness = 50 + Math.max(0, pulse) * 40;

          ctx.beginPath();
          ctx.arc(x, y, baseDotSize + pulse * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(189, 100%, ${lightness}%, ${opacityWave})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default GeometricPattern;

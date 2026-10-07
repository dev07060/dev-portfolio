'use client';

import { useEffect, useState } from 'react';

export interface ImageSize {
  width: number;
  height: number;
}

// Screens taller than this (height / width) are long pages: they are shown at full
// frame width inside a scrollable viewport instead of being shrunk to the frame height.
export const TALL_SCREEN_RATIO = 1.6;

const cache = new Map<string, ImageSize>();

/**
 * Intrinsic size of an image, measured once per src and cached for the session.
 * SVGs without width/height report a default box with the correct aspect ratio,
 * which is all the fit decision needs.
 */
export const useImageSize = (src?: string): ImageSize | null => {
  const [measured, setMeasured] = useState<{ src: string; size: ImageSize } | null>(null);

  useEffect(() => {
    if (!src || cache.has(src)) return;
    let active = true;
    const image = new window.Image();
    image.onload = () => {
      if (!image.naturalWidth || !image.naturalHeight) return;
      const size = { width: image.naturalWidth, height: image.naturalHeight };
      cache.set(src, size);
      if (active) setMeasured({ src, size });
    };
    image.src = src;
    return () => {
      active = false;
    };
  }, [src]);

  if (!src) return null;
  return cache.get(src) ?? (measured?.src === src ? measured.size : null);
};

export const isTallScreen = (size: ImageSize | null) =>
  size !== null && size.height / size.width > TALL_SCREEN_RATIO;

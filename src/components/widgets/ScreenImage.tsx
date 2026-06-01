'use client';

import Image from 'next/image';
import { ImageOff, Loader2 } from 'lucide-react';
import { useState } from 'react';

type BaseProps = {
  src: string;
  alt: string;
  fallbackGradient?: string;
  priority?: boolean;
};

type Props =
  | (BaseProps & { variant: 'fill' })
  | (BaseProps & { variant: 'scroll' });

const DEFAULT_GRADIENT = 'from-slate-700 to-slate-900';

const ScreenImage = (props: Props) => {
  const { src, alt, fallbackGradient = DEFAULT_GRADIENT, priority, variant } = props;
  const [imageState, setImageState] = useState({
    src,
    loaded: false,
    error: false,
  });

  const loaded = imageState.src === src && imageState.loaded;
  const error = imageState.src === src && imageState.error;

  const skeleton = !loaded && !error && (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${fallbackGradient} animate-pulse flex items-center justify-center`}
    >
      <Loader2 size={28} className="text-white/60 animate-spin" />
    </div>
  );

  const errorState = error && (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br ${fallbackGradient} flex flex-col items-center justify-center gap-2 text-white/70`}
    >
      <ImageOff size={28} />
      <span className="text-[11px] tracking-wide">Image unavailable</span>
    </div>
  );

  if (variant === 'fill') {
    return (
      <>
        {skeleton}
        {errorState}
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          onLoad={() => setImageState({ src, loaded: true, error: false })}
          onError={() => setImageState({ src, loaded: false, error: true })}
          className={`object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </>
    );
  }

  return (
    <>
      {skeleton}
      {errorState}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setImageState({ src, loaded: true, error: false })}
        onError={() => setImageState({ src, loaded: false, error: true })}
        className={`relative z-10 w-full h-auto transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  );
};

export default ScreenImage;

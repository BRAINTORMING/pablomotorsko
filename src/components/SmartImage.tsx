import { useEffect, useState } from 'react';
import { placeholder, search } from '../lib/images';

interface SmartImageProps {
  query: string;
  seed?: number;
  w: number;
  h: number;
  alt?: string;
  eager?: boolean;
  className?: string;
}

/** Image that never stays blank: a placeholder first, then a search photo when available, and the placeholder on error. */
export function SmartImage({ query, seed = 0, w, h, alt = '', eager = false, className = '' }: SmartImageProps) {
  const [src, setSrc] = useState(() => placeholder(query, w, h));

  useEffect(() => {
    let alive = true;
    setSrc(placeholder(query, w, h));
    search(query, seed, w, h).then((url) => {
      if (alive && url) setSrc(url);
    });
    return () => {
      alive = false;
    };
  }, [query, seed, w, h]);

  return (
    <img
      src={src}
      alt={alt}
      width={w}
      height={h}
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setSrc(placeholder(query, w, h))}
      className={'block h-auto w-full max-w-full object-cover bg-sunken ' + className}
    />
  );
}
import { memo, useCallback, useState } from 'react'

export interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  srcSet?: string
  sizes?: string
  fetchPriority?: 'high' | 'low' | 'auto'
  style?: React.CSSProperties
  /** Fallback image URL if src fails to load */
  fallback?: string
  /**
   * Fill a positioned parent (e.g. aspect-ratio frame). Omits intrinsic size attrs
   * that fight absolute stretch / object-fit:cover on mobile.
   */
  fill?: boolean
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop'

function OptimizedImageComponent({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  decoding = 'async',
  srcSet,
  sizes,
  fetchPriority,
  style,
  fallback = DEFAULT_FALLBACK,
  fill = false,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const handleError = useCallback(() => {
    setImgSrc((prev) => (prev === src ? fallback : prev))
  }, [src, fallback])

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      srcSet={srcSet}
      sizes={sizes}
      className={className}
      style={
        fill
          ? {
              display: 'block',
              width: '100%',
              height: '100%',
              maxWidth: 'none',
              maxHeight: 'none',
              aspectRatio: 'unset',
              objectFit: 'cover',
              ...style,
            }
          : { aspectRatio: `${width} / ${height}`, ...style }
      }
      onError={handleError}
    />
  )
}

export const OptimizedImage = memo(OptimizedImageComponent)

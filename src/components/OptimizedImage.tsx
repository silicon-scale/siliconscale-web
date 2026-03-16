import { memo } from 'react'

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
}

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
  fallback,
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      srcSet={srcSet}
      sizes={sizes}
      className={className}
      style={{ ...style, aspectRatio: `${width} / ${height}` }}
      onError={fallback ? (e) => { (e.currentTarget as HTMLImageElement).src = fallback } : undefined}
    />
  )
}

export const OptimizedImage = memo(OptimizedImageComponent)

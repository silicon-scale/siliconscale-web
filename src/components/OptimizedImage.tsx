import { memo, useCallback, useState } from 'react'
import type { ResponsivePicture } from '@/types/images'

export interface OptimizedImageProps {
  /**
   * Plain URL, or a `?responsive` import (ResponsivePicture) which renders a
   * <picture> with AVIF/WebP srcsets and intrinsic width/height automatically.
   */
  src: string | ResponsivePicture
  alt: string
  /** Optional for ResponsivePicture sources (intrinsic size is used). */
  width?: number
  height?: number
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
  const picture = typeof src === 'object' ? src : null
  const baseSrc = picture ? picture.img.src : src
  const [failed, setFailed] = useState(false)
  const handleError = useCallback(() => setFailed(true), [])

  const intrinsicWidth = width ?? picture?.img.w
  const intrinsicHeight = height ?? picture?.img.h
  // Without sizes, browsers assume 100vw for srcset selection — make it explicit.
  const resolvedSizes = picture && !failed ? (sizes ?? '100vw') : sizes

  const img = (
    <img
      src={failed ? fallback : (baseSrc as string)}
      alt={alt}
      width={fill ? undefined : intrinsicWidth}
      height={fill ? undefined : intrinsicHeight}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      srcSet={failed ? undefined : srcSet}
      sizes={resolvedSizes}
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
          : {
              ...(intrinsicWidth && intrinsicHeight
                ? { aspectRatio: `${intrinsicWidth} / ${intrinsicHeight}` }
                : undefined),
              ...style,
            }
      }
      onError={failed ? undefined : handleError}
    />
  )

  if (!picture || failed) return img

  return (
    // display:contents keeps the wrapper out of layout (flex/grid/percent sizing
    // behaves exactly as it did when the <img> was the direct child).
    <picture style={{ display: 'contents' }}>
      {Object.entries(picture.sources).map(([format, formatSrcSet]) => (
        <source
          key={format}
          type={`image/${format}`}
          srcSet={formatSrcSet}
          sizes={resolvedSizes}
        />
      ))}
      {img}
    </picture>
  )
}

export const OptimizedImage = memo(OptimizedImageComponent)

import { memo, useState, useCallback } from 'react'

export interface ImageWithFallbackProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
  fallback?: string
  loading?: 'lazy' | 'eager'
}

function ImageWithFallbackComponent({
  src,
  alt,
  width,
  height,
  className,
  style,
  fallback = 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop',
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const handleError = useCallback(() => {
    setImgSrc((prev) => (prev === src ? fallback : prev))
  }, [src, fallback])

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={width && height ? { ...style, aspectRatio: `${width} / ${height}` } : style}
      onError={handleError}
      loading={loading}
      decoding="async"
    />
  )
}

export const ImageWithFallback = memo(ImageWithFallbackComponent)
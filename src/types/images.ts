/**
 * Output shape of a `?responsive` image import (vite-imagetools `as=picture`).
 *
 * `sources` maps format → srcset ("…-800w.avif 800w, …-1400w.avif 1400w, …"),
 * `img` is the largest WebP fallback with its intrinsic dimensions.
 */
export interface ResponsivePicture {
  sources: Record<string, string>
  img: { src: string; w: number; h: number }
}

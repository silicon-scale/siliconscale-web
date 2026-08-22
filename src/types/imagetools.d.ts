/**
 * `?responsive` imports are expanded by vite-imagetools (see vite.config.ts)
 * into AVIF + WebP srcsets at 800/1400/2000w plus a WebP fallback.
 * Shape mirrors ResponsivePicture in src/types/images.ts.
 */
declare module '*?responsive' {
  const picture: {
    sources: Record<string, string>
    img: { src: string; w: number; h: number }
  }
  export default picture
}

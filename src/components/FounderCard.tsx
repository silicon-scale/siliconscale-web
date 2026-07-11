import { OptimizedImage } from './OptimizedImage'

export type Founder = {
  name: string
  role: string
  description: string
  image: string
  /** CSS object-position — per-photo when intrinsic ratio differs from the 4/5 crop */
  objectPosition?: string
}

type FounderCardProps = {
  founder: Founder
  /** md breakpoint: center the orphaned third card in a 2-col grid (existing layout) */
  featuredOnMd?: boolean
}

export function FounderCard({ founder, featuredOnMd = false }: FounderCardProps) {
  const { name, role, description, image, objectPosition = 'center top' } = founder

  return (
    <article
      className={`transition-all duration-500 hover:-translate-y-2 ${
        featuredOnMd
          ? 'md:col-span-2 md:max-w-[calc(50%-1.5rem)] md:justify-self-center lg:col-span-1 lg:max-w-none lg:justify-self-stretch'
          : ''
      }`}
    >
      <div
        className="relative overflow-hidden group aspect-[4/5]"
        style={{ background: '#0e0c0a', border: '0.5px solid #2a2218' }}
      >
        <OptimizedImage
          src={image}
          alt={name}
          width={800}
          height={1000}
          className="w-full h-full object-cover transition-transform duration-1200 ease-out group-hover:scale-110"
          style={{ objectPosition, aspectRatio: 'auto' }}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div
        className="p-6 md:p-7 text-center transition-all duration-500"
        style={{ background: '#050402', border: '0.5px solid #1e1a13', borderTop: 'none' }}
      >
        <span
          className="inline-block mb-3 uppercase"
          style={{
            fontSize: '1rem',
            letterSpacing: '0.1em',
            color: 'white',
            padding: '5px 12px',
          }}
        >
          {role}
        </span>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 2vw, 1.8rem)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}
        >
          {name}
        </h2>

        <p
          className="leading-relaxed"
          style={{
            fontSize: 'clamp(0.95rem, 1.1vw, 1.05rem)',
            fontWeight: 300,
            color: '#a0a0a0',
            fontStyle: 'italic',
            letterSpacing: '0.01em',
          }}
        >
          {description}
        </p>
      </div>
    </article>
  )
}

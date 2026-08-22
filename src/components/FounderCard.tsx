import { OptimizedImage } from './OptimizedImage'

export type Founder = {
  name: string
  role: string
  description: string
  image: string
  /** CSS object-position — per-photo when intrinsic ratio differs from the crop */
  objectPosition?: string
}

type FounderCardProps = {
  founder: Founder
}

export function FounderCard({ founder }: FounderCardProps) {
  const {
    name,
    role,
    description,
    image,
    objectPosition = '50% 10%',
  } = founder

  return (
    <article
      className="group flex flex-col items-center px-6 py-10 text-center transition-transform duration-500 hover:-translate-y-2 md:px-7"
      style={{
        background: '#050402',
        border: '0.5px solid #1e1a13',
      }}
    >
      {/* Image — square, large */}
      <div
        className="relative mb-6 overflow-hidden rounded-xl"
        style={{
          width: 'clamp(220px, 24vw, 340px)',
          height: 'clamp(220px, 24vw, 340px)',
          background: '#0e0c0a',
          border: '1px solid #2a2218',
        }}
      >
        <OptimizedImage
          src={image}
          alt={name}
          width={680}
          height={680}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 60vw, 340px"
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
          style={{ objectPosition }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center">
        <span
          className="mb-3 inline-block uppercase"
          style={{
            fontSize: '1rem',
            letterSpacing: '0.1em',
            color: '#ffffff',
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
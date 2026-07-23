import { Fragment } from "react"
import { cn } from "@/lib/utils"

interface BlogTagsProps {
  tags: string[]
  /** Optional cap for dense list cards */
  limit?: number
  className?: string
}

/**
 * Editorial tag metadata — muted uppercase labels separated by middle dots.
 * Not pills/buttons; matches date · read-time meta language on blog surfaces.
 */
export function BlogTags({ tags, limit, className }: BlogTagsProps) {
  const list = (limit != null ? tags.slice(0, limit) : tags)
    .map((tag) => tag.trim())
    .filter(Boolean)

  if (!list.length) return null

  return (
    <p className={cn("blog-tags", className)} aria-label={`Tags: ${list.join(", ")}`}>
      {list.map((tag, index) => (
        <Fragment key={`${tag}-${index}`}>
          {index > 0 ? (
            <span className="blog-tags-sep" aria-hidden="true">
              ·
            </span>
          ) : null}
          <span className="blog-tags-item">{tag}</span>
        </Fragment>
      ))}
    </p>
  )
}

/** Shared CSS for BlogTags — include once in each blog page stylesheet. */
export const blogTagsCss = `
  .blog-tags {
    margin: 0;
    font-family: 'Open Sans', system-ui, sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.45);
  }
  .blog-tags-sep {
    margin: 0 0.55rem;
    color: rgba(255, 255, 255, 0.28);
  }
  .blog-tags-item {
    color: inherit;
  }
`

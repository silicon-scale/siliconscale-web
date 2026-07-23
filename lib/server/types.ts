export type PostStatus = "draft" | "published"

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string | null
  tags: string[]
  status: PostStatus
  reading_time_minutes: number
  meta_title: string | null
  meta_description: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostInput {
  slug: string
  title: string
  excerpt?: string
  content?: string
  cover_image_url?: string | null
  tags?: string[]
  status?: PostStatus
  meta_title?: string | null
  meta_description?: string | null
}

export interface PostUpdateInput extends Partial<PostInput> {}

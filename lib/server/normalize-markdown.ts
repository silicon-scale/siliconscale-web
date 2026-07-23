/**
 * Normalize markdown so soft line wraps become spaces, while paragraph
 * breaks (blank lines) and structural blocks (lists, headings, code) stay intact.
 */
export function normalizeMarkdownContent(markdown: string): string {
  if (!markdown) return ""

  const normalized = markdown.replace(/\r\n?/g, "\n").replace(/^\uFEFF/, "")

  const fences: string[] = []
  const withoutFences = normalized.replace(/```[\s\S]*?```/g, (block) => {
    const index = fences.length
    fences.push(block)
    return `\n\n%%CODE_FENCE_${index}%%\n\n`
  })

  const blocks = withoutFences.split(/\n{2,}/)
  const rebuilt = blocks
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ""

      const lines = trimmed.split("\n")
      const structural = lines.some((line) =>
        /^(#{1,6}\s|([-*+]|\d+\.)\s|>\s?|\||\s*(-{3,}|\*{3,}|_{3,})\s*$|%%CODE_FENCE_)/.test(
          line.trim(),
        ),
      )

      if (structural) {
        return lines.map((line) => line.trimEnd()).join("\n")
      }

      return lines
        .map((line) => line.trim())
        .filter((line, index, arr) => line.length > 0 || (index > 0 && index < arr.length - 1))
        .join(" ")
        .replace(/ {2,}/g, " ")
        .trim()
    })
    .filter(Boolean)
    .join("\n\n")

  return rebuilt.replace(/%%CODE_FENCE_(\d+)%%/g, (_match, index: string) => {
    return fences[Number(index)] ?? ""
  })
}

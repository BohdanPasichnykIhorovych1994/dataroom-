import { INVALID_NAME_CHARS } from '@/constants/names'
import { PDF_EXTENSION } from '@/constants/files'

export function sanitizeName(raw: string): string {
  return raw.trim().replace(INVALID_NAME_CHARS, '').replace(/\s+/g, ' ')
}

export function ensurePdfExtension(name: string): string {
  const trimmed = name.trim()
  if (trimmed.toLowerCase().endsWith(PDF_EXTENSION)) return trimmed
  return `${trimmed}${PDF_EXTENSION}`
}

export function splitNameAndExt(name: string): { base: string; ext: string } {
  const lastDot = name.lastIndexOf('.')
  if (lastDot <= 0) return { base: name, ext: '' }
  return { base: name.slice(0, lastDot), ext: name.slice(lastDot) }
}

export function uniqueNameAmong(
  desired: string,
  existingNames: Iterable<string>,
): string {
  const taken = new Set([...existingNames].map((n) => n.toLowerCase()))

  if (!taken.has(desired.toLowerCase())) return desired

  const { base, ext } = splitNameAndExt(desired)
  let i = 1
  while (true) {
    const candidate = `${base} (${i})${ext}`
    if (!taken.has(candidate.toLowerCase())) return candidate
    i += 1
  }
}

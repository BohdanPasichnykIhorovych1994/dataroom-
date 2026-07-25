import { describe, expect, it } from 'vitest'
import { formatBytes, formatDate } from '@/helpers/format'

describe('formatBytes', () => {
  it('formats bytes under 1KB', () => {
    expect(formatBytes(500)).toBe('500 B')
  })

  it('formats kilobytes', () => {
    expect(formatBytes(2048)).toBe('2.0 KB')
  })

  it('formats megabytes', () => {
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})

describe('formatDate', () => {
  it('returns a non-empty localized string', () => {
    const formatted = formatDate(Date.UTC(2024, 0, 15, 12, 0, 0))
    expect(formatted.length).toBeGreaterThan(0)
  })
})

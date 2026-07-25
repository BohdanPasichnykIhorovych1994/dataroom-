import { describe, expect, it } from 'vitest'
import { isPdfFile } from '@/helpers/files'

describe('isPdfFile', () => {
  it('accepts application/pdf', () => {
    expect(
      isPdfFile(new File(['x'], 'a.bin', { type: 'application/pdf' })),
    ).toBe(true)
  })

  it('accepts .pdf extension even with empty mime', () => {
    expect(isPdfFile(new File(['x'], 'Report.PDF', { type: '' }))).toBe(true)
  })

  it('rejects other types', () => {
    expect(
      isPdfFile(new File(['x'], 'photo.png', { type: 'image/png' })),
    ).toBe(false)
  })
})

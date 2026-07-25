import { describe, expect, it } from 'vitest'
import {
  ensurePdfExtension,
  sanitizeName,
  splitNameAndExt,
  uniqueNameAmong,
} from '@/helpers/names'

describe('sanitizeName', () => {
  it('trims and collapses whitespace', () => {
    expect(sanitizeName('  Legal   Docs  ')).toBe('Legal Docs')
  })

  it('strips invalid path characters', () => {
    expect(sanitizeName('a/b\\c:d*e?f"g<h>i|j')).toBe('abcdefghij')
  })
})

describe('ensurePdfExtension', () => {
  it('keeps existing .pdf (case-insensitive)', () => {
    expect(ensurePdfExtension('Report.PDF')).toBe('Report.PDF')
  })

  it('appends .pdf when missing', () => {
    expect(ensurePdfExtension('Report')).toBe('Report.pdf')
  })
})

describe('splitNameAndExt', () => {
  it('splits base and extension', () => {
    expect(splitNameAndExt('Report.pdf')).toEqual({
      base: 'Report',
      ext: '.pdf',
    })
  })

  it('handles names without extension', () => {
    expect(splitNameAndExt('Folder')).toEqual({ base: 'Folder', ext: '' })
  })
})

describe('uniqueNameAmong', () => {
  it('returns desired name when free', () => {
    expect(uniqueNameAmong('Legal', ['Finance'])).toBe('Legal')
  })

  it('adds (1) on conflict (case-insensitive)', () => {
    expect(uniqueNameAmong('legal', ['Legal'])).toBe('legal (1)')
  })

  it('increments until free for files', () => {
    expect(
      uniqueNameAmong('Report.pdf', [
        'Report.pdf',
        'Report (1).pdf',
        'Report (2).pdf',
      ]),
    ).toBe('Report (3).pdf')
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob } from '@/helpers/download'

describe('downloadBlob', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(() => 'blob:mock-url'),
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an object URL, clicks a download link, and revokes it', () => {
    const click = vi.fn()
    vi.spyOn(document, 'createElement').mockReturnValue({
      click,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement)

    const blob = new Blob(['pdf'], { type: 'application/pdf' })
    downloadBlob(blob, 'deck.pdf')

    expect(URL.createObjectURL).toHaveBeenCalledWith(blob)
    expect(click).toHaveBeenCalledOnce()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})

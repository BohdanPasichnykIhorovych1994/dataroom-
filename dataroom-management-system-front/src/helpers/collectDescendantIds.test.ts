import { describe, expect, it } from 'vitest'
import { collectDescendantIds } from '@/helpers/nodes'
import type { DataroomNode } from '@/types'

function folder(
  id: string,
  name: string,
  parentId: string | null,
): DataroomNode {
  return {
    id,
    type: 'folder',
    name,
    parentId,
    createdAt: 1,
    updatedAt: 1,
  }
}

function file(id: string, name: string, parentId: string | null): DataroomNode {
  return {
    id,
    type: 'file',
    name,
    parentId,
    size: 10,
    mimeType: 'application/pdf',
    createdAt: 1,
    updatedAt: 1,
  }
}

describe('collectDescendantIds', () => {
  const nodes: DataroomNode[] = [
    folder('root', 'Root', null),
    folder('legal', 'Legal', 'root'),
    folder('q1', 'Q1', 'legal'),
    file('nda', 'NDA.pdf', 'legal'),
    file('deck', 'Deck.pdf', 'q1'),
    folder('other', 'Other', null),
  ]

  it('includes the root and all nested children', () => {
    const ids = collectDescendantIds('root', nodes)
    expect(ids.sort()).toEqual(
      ['root', 'legal', 'q1', 'nda', 'deck'].sort(),
    )
  })

  it('does not include unrelated branches', () => {
    const ids = collectDescendantIds('legal', nodes)
    expect(ids).not.toContain('other')
    expect(ids).not.toContain('root')
  })

  it('returns only the node for a leaf file', () => {
    expect(collectDescendantIds('nda', nodes)).toEqual(['nda'])
  })
})

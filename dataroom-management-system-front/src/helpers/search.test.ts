import { describe, expect, it } from 'vitest'
import { filterNodesByQuery, isFile, isFolder } from '@/helpers'
import type { DataroomNode } from '@/types'

const nodes: DataroomNode[] = [
  {
    id: '1',
    type: 'folder',
    name: 'Legal',
    parentId: null,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: '2',
    type: 'file',
    name: 'NDA Template.pdf',
    parentId: '1',
    size: 1,
    mimeType: 'application/pdf',
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: '3',
    type: 'folder',
    name: 'Finance',
    parentId: null,
    createdAt: 1,
    updatedAt: 1,
  },
]

describe('filterNodesByQuery', () => {
  it('matches case-insensitively across the tree', () => {
    const results = filterNodesByQuery(nodes, 'nda')
    expect(results).toHaveLength(1)
    expect(results[0]?.name).toBe('NDA Template.pdf')
  })

  it('returns empty for blank query', () => {
    expect(filterNodesByQuery(nodes, '   ')).toEqual([])
  })

  it('finds folders by partial name', () => {
    expect(filterNodesByQuery(nodes, 'fin').map((n) => n.name)).toEqual([
      'Finance',
    ])
  })

  it('lists folders before files', () => {
    const results = filterNodesByQuery(nodes, 'e')
    const types = results.map((n) => n.type)
    const firstFile = types.indexOf('file')
    const lastFolder = types.lastIndexOf('folder')
    if (firstFile !== -1 && lastFolder !== -1) {
      expect(lastFolder).toBeLessThan(firstFile)
    }
  })
})

describe('type guards', () => {
  it('narrows folder and file nodes', () => {
    const folderNode = nodes[0]!
    const fileNode = nodes[1]!
    expect(isFolder(folderNode)).toBe(true)
    expect(isFile(folderNode)).toBe(false)
    expect(isFile(fileNode)).toBe(true)
    expect(isFolder(fileNode)).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'
import { filterNodesByQuery, isFile, isFolder } from '@/helpers'
import type { DataroomNode } from '@/types'
import { NODE_TYPE } from '@/constants'

const nodes: DataroomNode[] = [
  {
    id: '1',
    type: NODE_TYPE.FOLDER,
    name: 'Legal',
    parentId: null,
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: '2',
    type: NODE_TYPE.FILE,
    name: 'NDA Template.pdf',
    parentId: '1',
    size: 1,
    mimeType: 'application/pdf',
    createdAt: 1,
    updatedAt: 1,
  },
  {
    id: '3',
    type: NODE_TYPE.FOLDER,
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
    const firstFile = types.indexOf(NODE_TYPE.FILE)
    const lastFolder = types.lastIndexOf(NODE_TYPE.FOLDER)
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

import { describe, expect, it } from 'vitest'
import { compareNodes, sortNodesBy } from '@/helpers/nodes'
import type { DataroomNode } from '@/types'

const folderA: DataroomNode = {
  id: 'fa',
  type: 'folder',
  name: 'Alpha',
  parentId: null,
  createdAt: 1,
  updatedAt: 10,
}

const folderB: DataroomNode = {
  id: 'fb',
  type: 'folder',
  name: 'Beta',
  parentId: null,
  createdAt: 1,
  updatedAt: 30,
}

const fileSmall: DataroomNode = {
  id: 'fs',
  type: 'file',
  name: 'small.pdf',
  parentId: null,
  size: 100,
  mimeType: 'application/pdf',
  createdAt: 1,
  updatedAt: 20,
}

const fileLarge: DataroomNode = {
  id: 'fl',
  type: 'file',
  name: 'large.pdf',
  parentId: null,
  size: 9000,
  mimeType: 'application/pdf',
  createdAt: 1,
  updatedAt: 5,
}

describe('compareNodes / sortNodesBy', () => {
  it('keeps folders before files', () => {
    expect(compareNodes(folderA, fileSmall, 'size', 'desc')).toBeLessThan(0)
  })

  it('sorts by name', () => {
    expect(sortNodesBy([folderB, folderA], 'name', 'asc').map((n) => n.name)).toEqual([
      'Alpha',
      'Beta',
    ])
  })

  it('sorts files by size', () => {
    expect(
      sortNodesBy([fileLarge, fileSmall], 'size', 'asc').map((n) => n.id),
    ).toEqual(['fs', 'fl'])
  })

  it('sorts by date descending', () => {
    expect(
      sortNodesBy([folderA, folderB, fileSmall], 'date', 'desc').map((n) => n.id),
    ).toEqual(['fb', 'fa', 'fs'])
  })
})

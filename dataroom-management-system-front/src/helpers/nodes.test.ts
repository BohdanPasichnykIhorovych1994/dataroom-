import { describe, expect, it } from 'vitest'
import { NODE_TYPE, SORT_DIRECTION, SORT_FIELD } from '@/constants'
import { compareNodes, sortNodesBy } from '@/helpers/nodes'
import type { DataroomNode } from '@/types'

const folderA: DataroomNode = {
  id: 'fa',
  type: NODE_TYPE.FOLDER,
  name: 'Alpha',
  parentId: null,
  createdAt: 1,
  updatedAt: 10,
}

const folderB: DataroomNode = {
  id: 'fb',
  type: NODE_TYPE.FOLDER,
  name: 'Beta',
  parentId: null,
  createdAt: 1,
  updatedAt: 30,
}

const fileSmall: DataroomNode = {
  id: 'fs',
  type: NODE_TYPE.FILE,
  name: 'small.pdf',
  parentId: null,
  size: 100,
  mimeType: 'application/pdf',
  createdAt: 1,
  updatedAt: 20,
}

const fileLarge: DataroomNode = {
  id: 'fl',
  type: NODE_TYPE.FILE,
  name: 'large.pdf',
  parentId: null,
  size: 9000,
  mimeType: 'application/pdf',
  createdAt: 1,
  updatedAt: 5,
}

describe('compareNodes / sortNodesBy', () => {
  it('keeps folders before files', () => {
    expect(
      compareNodes(folderA, fileSmall, SORT_FIELD.SIZE, SORT_DIRECTION.DESC),
    ).toBeLessThan(0)
  })

  it('sorts by name', () => {
    expect(
      sortNodesBy([folderB, folderA], SORT_FIELD.NAME, SORT_DIRECTION.ASC).map(
        (n) => n.name,
      ),
    ).toEqual(['Alpha', 'Beta'])
  })

  it('sorts files by size', () => {
    expect(
      sortNodesBy([fileLarge, fileSmall], SORT_FIELD.SIZE, SORT_DIRECTION.ASC).map(
        (n) => n.id,
      ),
    ).toEqual(['fs', 'fl'])
  })

  it('sorts by date descending', () => {
    expect(
      sortNodesBy(
        [folderA, folderB, fileSmall],
        SORT_FIELD.DATE,
        SORT_DIRECTION.DESC,
      ).map((n) => n.id),
    ).toEqual(['fb', 'fa', 'fs'])
  })
})

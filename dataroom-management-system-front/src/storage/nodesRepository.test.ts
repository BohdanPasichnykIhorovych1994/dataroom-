import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { FileNode, FolderNode } from '@/types'
import {
  createFolder,
  deleteNode,
  getAllNodes,
  getBlob,
  renameNode,
  uploadFile,
} from '@/storage/nodesRepository'

const now = 1_700_000_000_000

function makeFolder(
  id: string,
  name: string,
  parentId: string | null,
): FolderNode {
  return {
    id,
    type: 'folder',
    name,
    parentId,
    createdAt: now,
    updatedAt: now,
  }
}

function makeFile(id: string, name: string, parentId: string | null): FileNode {
  return {
    id,
    type: 'file',
    name,
    parentId,
    size: 4,
    mimeType: 'application/pdf',
    createdAt: now,
    updatedAt: now,
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('nodesRepository (HTTP)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('lists nodes', async () => {
    const folder = makeFolder('f1', 'Legal', null)
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse([folder]))

    const all = await getAllNodes()
    expect(all).toEqual([folder])
    expect(fetch).toHaveBeenCalledWith(
      '/api/nodes',
      expect.objectContaining({ headers: expect.any(Headers) }),
    )
  })

  it('creates a folder', async () => {
    const folder = makeFolder('f1', 'Legal', null)
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(folder, 201))

    const created = await createFolder({ name: 'Legal', parentId: null })
    expect(created).toEqual(folder)
    expect(fetch).toHaveBeenCalledWith(
      '/api/nodes/folders',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Legal', parentId: null }),
      }),
    )
  })

  it('uploads a file via multipart', async () => {
    const fileNode = makeFile('pdf1', 'NDA.pdf', null)
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(fileNode, 201))

    const file = new File(['%PDF'], 'NDA.pdf', { type: 'application/pdf' })
    const created = await uploadFile({
      name: 'NDA.pdf',
      parentId: null,
      file,
    })

    expect(created).toEqual(fileNode)
    const [, init] = vi.mocked(fetch).mock.calls[0]!
    expect(init?.method).toBe('POST')
    expect(init?.body).toBeInstanceOf(FormData)
  })

  it('renames a node', async () => {
    const updated = makeFolder('f1', 'Vault', null)
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(updated))

    await expect(renameNode('f1', 'Vault')).resolves.toEqual(updated)
    expect(fetch).toHaveBeenCalledWith(
      '/api/nodes/f1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ name: 'Vault' }),
      }),
    )
  })

  it('deletes a node and returns deleted ids', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ deletedIds: ['parent', 'child'] }),
    )

    await expect(deleteNode('parent')).resolves.toEqual(['parent', 'child'])
    expect(fetch).toHaveBeenCalledWith(
      '/api/nodes/parent',
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('loads file content blob', async () => {
    const blob = new Blob(['%PDF'], { type: 'application/pdf' })
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(blob, {
        status: 200,
        headers: { 'Content-Type': 'application/pdf' },
      }),
    )

    const result = await getBlob('pdf1')
    expect(result).toBeTruthy()
    expect(result!.size).toBeGreaterThan(0)
    expect(fetch).toHaveBeenCalledWith(
      '/api/nodes/pdf1/content',
      expect.objectContaining({ headers: expect.any(Headers) }),
    )
  })

  it('returns undefined for missing blob', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ message: 'Not found' }, 404),
    )
    await expect(getBlob('missing')).resolves.toBeUndefined()
  })
})

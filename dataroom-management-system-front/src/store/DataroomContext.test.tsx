import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { DataroomProvider, useDataroom } from '@/store/DataroomContext'
import type { DataroomNode, FileNode, FolderNode, NodeId } from '@/types'
import { NODE_TYPE } from '@/constants'

const {
  getAllNodes,
  createFolderRequest,
  uploadFile,
  renameNodeRequest,
  deleteNodeRequest,
  getBlob,
} = vi.hoisted(() => ({
  getAllNodes: vi.fn(),
  createFolderRequest: vi.fn(),
  uploadFile: vi.fn(),
  renameNodeRequest: vi.fn(),
  deleteNodeRequest: vi.fn(),
  getBlob: vi.fn(),
}))

vi.mock('@/storage/nodesRepository', () => ({
  getAllNodes,
  createFolder: createFolderRequest,
  uploadFile,
  renameNode: renameNodeRequest,
  deleteNode: deleteNodeRequest,
  getBlob,
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    message: vi.fn(),
  },
}))

const now = 1_700_000_000_000
let idSeq = 0

function nextId(): NodeId {
  idSeq += 1
  return `id-${idSeq}`
}

function Probe() {
  const {
    loading,
    nodes,
    createFolder,
    uploadPdf,
    renameNode,
    deleteNode,
    siblingNames,
  } = useDataroom()

  if (loading) return <div>loading</div>

  return (
    <div>
      <div data-testid="count">{nodes.length}</div>
      <div data-testid="root-names">{siblingNames(null).join(',')}</div>
      <button
        type="button"
        onClick={() => void createFolder(null, 'Archive')}
      >
        create-archive
      </button>
      <button
        type="button"
        onClick={() => {
          const file = new File(['%PDF'], 'Deck.pdf', {
            type: 'application/pdf',
          })
          void uploadPdf(null, file)
        }}
      >
        upload-pdf
      </button>
      <button
        type="button"
        onClick={() => {
          const file = new File(['nope'], 'notes.txt', { type: 'text/plain' })
          void uploadPdf(null, file)
        }}
      >
        upload-txt
      </button>
      <button
        type="button"
        onClick={() => {
          const folder = nodes.find((n) => n.name === 'Archive')
          if (folder) void renameNode(folder.id, 'Vault')
        }}
      >
        rename-archive
      </button>
      <button
        type="button"
        onClick={() => {
          const folder = nodes.find((n) => n.name === 'Vault' || n.name === 'Archive')
          if (folder) void deleteNode(folder.id)
        }}
      >
        delete-archive
      </button>
    </div>
  )
}

function renderProvider() {
  return render(
    <MemoryRouter>
      <DataroomProvider>
        <Probe />
      </DataroomProvider>
    </MemoryRouter>,
  )
}

describe('DataroomProvider', () => {
  let memory: DataroomNode[]

  beforeEach(() => {
    memory = []
    idSeq = 0
    vi.clearAllMocks()

    getAllNodes.mockImplementation(async () => [...memory])

    createFolderRequest.mockImplementation(
      async (input: { name: string; parentId: NodeId | null }) => {
        const folder: FolderNode = {
          id: nextId(),
          type: NODE_TYPE.FOLDER,
          name: input.name,
          parentId: input.parentId,
          createdAt: now,
          updatedAt: now,
        }
        memory.push(folder)
        return folder
      },
    )

    uploadFile.mockImplementation(
      async (input: {
        name: string
        parentId: NodeId | null
        file: File
      }) => {
        const node: FileNode = {
          id: nextId(),
          type: NODE_TYPE.FILE,
          name: input.name,
          parentId: input.parentId,
          size: input.file.size,
          mimeType: 'application/pdf',
          createdAt: now,
          updatedAt: now,
        }
        memory.push(node)
        return node
      },
    )

    renameNodeRequest.mockImplementation(async (id: NodeId, name: string) => {
      const idx = memory.findIndex((n) => n.id === id)
      if (idx < 0) throw new Error('Not found')
      const updated = { ...memory[idx]!, name, updatedAt: now }
      memory[idx] = updated
      return updated
    })

    deleteNodeRequest.mockImplementation(async (id: NodeId) => {
      const deletedIds = memory.filter((n) => n.id === id).map((n) => n.id)
      memory = memory.filter((n) => n.id !== id)
      return deletedIds
    })
  })

  it('starts empty on first load', async () => {
    renderProvider()
    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('count').textContent).toBe('0')
    expect(screen.getByTestId('root-names').textContent).toBe('')
  })

  it('creates unique names on conflict', async () => {
    const user = userEvent.setup()
    renderProvider()

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'create-archive' }))
    await waitFor(() => {
      expect(screen.getByTestId('root-names').textContent).toContain('Archive')
    })

    await user.click(screen.getByRole('button', { name: 'create-archive' }))
    await waitFor(() => {
      expect(screen.getByTestId('root-names').textContent).toMatch(/Archive \(1\)/)
    })
  })

  it('rejects non-PDF uploads', async () => {
    const { toast } = await import('sonner')
    const user = userEvent.setup()
    renderProvider()

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })

    const before = Number(screen.getByTestId('count').textContent)
    await user.click(screen.getByRole('button', { name: 'upload-txt' }))
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled()
    })
    expect(Number(screen.getByTestId('count').textContent)).toBe(before)
    expect(uploadFile).not.toHaveBeenCalled()
  })

  it('uploads PDF, renames and deletes a folder', async () => {
    const user = userEvent.setup()
    renderProvider()

    await waitFor(() => {
      expect(screen.queryByText('loading')).not.toBeInTheDocument()
    })

    const before = Number(screen.getByTestId('count').textContent)

    await user.click(screen.getByRole('button', { name: 'upload-pdf' }))
    await waitFor(() => {
      expect(Number(screen.getByTestId('count').textContent)).toBe(before + 1)
    })
    expect(screen.getByTestId('root-names').textContent).toContain('Deck.pdf')

    await user.click(screen.getByRole('button', { name: 'create-archive' }))
    await waitFor(() => {
      expect(screen.getByTestId('root-names').textContent).toContain('Archive')
    })

    await user.click(screen.getByRole('button', { name: 'rename-archive' }))
    await waitFor(() => {
      expect(screen.getByTestId('root-names').textContent).toContain('Vault')
    })

    const afterRename = Number(screen.getByTestId('count').textContent)
    await user.click(screen.getByRole('button', { name: 'delete-archive' }))
    await waitFor(() => {
      expect(Number(screen.getByTestId('count').textContent)).toBe(afterRename - 1)
    })
    expect(screen.getByTestId('root-names').textContent).not.toContain('Vault')
  })
})

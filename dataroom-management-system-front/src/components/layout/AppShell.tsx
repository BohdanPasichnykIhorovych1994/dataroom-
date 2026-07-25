import { useMemo, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Database, Folder, LogOut } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/helpers'
import { useAuth } from '@/store/AuthContext'
import { useDataroom } from '@/store/DataroomContext'
import { useCurrentFolderId } from '@/hooks/useFolderNavigation'
import type { NodeId } from '@/types'

type AppShellProps = {
  children: ReactNode
}

function useActiveRootFolderId(currentId: NodeId | null): NodeId | null {
  const { nodesById } = useDataroom()

  return useMemo(() => {
    let id = currentId
    while (id) {
      const node = nodesById.get(id)
      if (!node || node.type !== 'folder') return null
      if (node.parentId === null) return node.id
      id = node.parentId
    }
    return null
  }, [currentId, nodesById])
}

export function AppShell({ children }: AppShellProps) {
  const { childrenByParent } = useDataroom()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const currentId = useCurrentFolderId()
  const activeRootId = useActiveRootFolderId(currentId)
  const rootFolders = (childrenByParent.get(null) ?? []).filter(
    (n) => n.type === 'folder',
  )

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full min-h-0 bg-[radial-gradient(ellipse_at_top,oklch(0.97_0.01_200)_0%,var(--background)_55%)]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Database className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">Data Room</p>
            <p className="truncate text-xs text-muted-foreground">Cloud workspace</p>
          </div>
        </div>
        <Separator />
        <ScrollArea className="flex-1 px-2 py-3">
          <nav className="flex flex-col gap-0.5">
            <Link
              to="/"
              className={cn(
                'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                currentId === null
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/70',
              )}
            >
              <Folder className="size-4 opacity-70" />
              All files
            </Link>
            {rootFolders.length > 0 && (
              <p className="mt-3 mb-1 px-2.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Folders
              </p>
            )}
            {rootFolders.map((folder) => {
              const isActive = activeRootId === folder.id
              return (
                <Link
                  key={folder.id}
                  to={`/folder/${folder.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/70',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Folder className="size-4 opacity-70" />
                  <span className="truncate">{folder.name}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="flex flex-col gap-2 px-3 py-3">
          {user?.email && (
            <p
              className="truncate px-1 text-sm font-medium text-muted-foreground"
              title={user.email}
            >
              {user.email}
            </p>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="justify-start gap-2 text-base font-semibold cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="size-4 opacity-70" />
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2 md:hidden">
          <p className="truncate text-sm font-medium">Data Room</p>
          <Button type="button" variant="ghost" size="sm" className="cursor-pointer" onClick={handleLogout}>
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>
        {children}
      </main>
    </div>
  )
}

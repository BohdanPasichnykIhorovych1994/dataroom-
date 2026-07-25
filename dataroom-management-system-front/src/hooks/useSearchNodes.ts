import { useDeferredValue, useMemo } from 'react'
import { filterNodesByQuery } from '@/helpers'
import type { DataroomNode } from '@/types'
import { useDataroom } from '@/store/DataroomContext'

export function useSearchNodes(query: string): DataroomNode[] {
  const { nodes } = useDataroom()
  const deferred = useDeferredValue(query)

  return useMemo(
    () => filterNodesByQuery(nodes, deferred),
    [nodes, deferred],
  )
}

import { Link } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useBreadcrumbPath, useCurrentFolderId } from '@/hooks/useFolderNavigation'
import { Fragment } from 'react'

export function FolderBreadcrumbs() {
  const folderId = useCurrentFolderId()
  const path = useBreadcrumbPath(folderId)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {path.length === 0 ? (
            <BreadcrumbPage>All files</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to="/">All files</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
        {path.map((item, index) => {
          const isLast = index === path.length - 1
          return (
            <Fragment key={item.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={`/folder/${item.id}`}>{item.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type DeleteConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  name: string
  kind: 'file' | 'folder'
  descendantCount: number
  onConfirm: () => void
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  name,
  kind,
  descendantCount,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const extra =
    kind === 'folder' && descendantCount > 0
      ? ` This will also permanently delete ${descendantCount} item${descendantCount === 1 ? '' : 's'} inside.`
      : ''

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete “{name}”?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.{extra}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

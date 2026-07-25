import { useEffect, useState, type SubmitEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MAX_NODE_NAME_LENGTH } from '@/constants'

type NameDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  initialName?: string
  placeholder?: string
  submitLabel?: string
  pendingLabel?: string
  onSubmit: (name: string) => Promise<void> | void
}

export function NameDialog({
  open,
  onOpenChange,
  title,
  description,
  initialName = '',
  placeholder,
  submitLabel = 'Save',
  pendingLabel = 'Saving…',
  onSubmit,
}: NameDialogProps) {
  const [name, setName] = useState(initialName)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (open) {
      setName(initialName)
      setPending(false)
    }
  }, [open, initialName])

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim() || pending) return
    setPending(true)
    try {
      await onSubmit(name)
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="node-name">Name</Label>
            <Input
              id="node-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={placeholder}
              autoFocus
              maxLength={MAX_NODE_NAME_LENGTH}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || pending}>
              {pending ? pendingLabel : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

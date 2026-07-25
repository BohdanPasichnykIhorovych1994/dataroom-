import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/helpers'

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchInput({ value, onChange, className }: SearchInputProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search files and folders…"
        className="h-8 pr-8 pl-8"
        aria-label="Search files and folders"
        autoComplete="off"
      />
      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X />
        </Button>
      )}
    </div>
  )
}

import { ArrowDownWideNarrow, ArrowUpDown, ArrowUpNarrowWide } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SortDirection, SortField } from '@/types'

type SortMenuProps = {
  sortBy: SortField
  direction: SortDirection
  onSortByChange: (field: SortField) => void
  onDirectionChange: (direction: SortDirection) => void
}

const FIELD_LABELS: Record<SortField, string> = {
  name: 'Name',
  size: 'Size',
  date: 'Date',
}

export function SortMenu({
  sortBy,
  direction,
  onSortByChange,
  onDirectionChange,
}: SortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Sort by ${FIELD_LABELS[sortBy]}, ${direction === 'asc' ? 'ascending' : 'descending'}`}
          title={`Sort by ${FIELD_LABELS[sortBy]}`}
        >
          <ArrowUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as SortField)}
        >
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">Size</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Order</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={direction}
          onValueChange={(value) => onDirectionChange(value as SortDirection)}
        >
          <DropdownMenuRadioItem value="asc">
            <ArrowUpNarrowWide />
            Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">
            <ArrowDownWideNarrow />
            Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

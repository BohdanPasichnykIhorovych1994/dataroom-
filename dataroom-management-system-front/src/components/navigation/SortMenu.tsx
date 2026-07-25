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
import { SORT_DIRECTION, SORT_FIELD } from '@/constants'

type SortMenuProps = {
  sortBy: SORT_FIELD
  direction: SORT_DIRECTION
  onSortByChange: (field: SORT_FIELD) => void
  onDirectionChange: (direction: SORT_DIRECTION) => void
}

const FIELD_LABELS: Record<SORT_FIELD, string> = {
  [SORT_FIELD.NAME]: 'Name',
  [SORT_FIELD.SIZE]: 'Size',
  [SORT_FIELD.DATE]: 'Date',
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
          aria-label={`Sort by ${FIELD_LABELS[sortBy]}, ${direction === SORT_DIRECTION.ASC ? 'ascending' : 'descending'}`}
          title={`Sort by ${FIELD_LABELS[sortBy]}`}
        >
          <ArrowUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(value) => onSortByChange(value as SORT_FIELD)}
        >
          <DropdownMenuRadioItem value={SORT_FIELD.NAME}>Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SORT_FIELD.SIZE}>Size</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SORT_FIELD.DATE}>Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Order</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={direction}
          onValueChange={(value) => onDirectionChange(value as SORT_DIRECTION)}
        >
          <DropdownMenuRadioItem value={SORT_DIRECTION.ASC}>
            <ArrowUpNarrowWide />
            Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={SORT_DIRECTION.DESC}>
            <ArrowDownWideNarrow />
            Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

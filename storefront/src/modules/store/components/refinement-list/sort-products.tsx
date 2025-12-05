'use client'

import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@lib/components/ui'
import { Calendar, CircleDollarSignIcon, DollarSign } from 'lucide-react'

export type SortOptions = 'price_asc' | 'price_desc' | 'created_at'

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  'data-testid'?: string
}

const sortOptions = [
  {
    value: 'created_at',
    label: 'Latest Arrivals',
    icon: <Calendar className="w-4 h-4" />
  },
  {
    value: 'price_asc',
    label: 'Price: Low to High',
    icon: <CircleDollarSignIcon className="w-4 h-4" />
  },
  {
    value: 'price_desc',
    label: 'Price: High to Low',
    icon: <CircleDollarSignIcon className="w-4 h-4" />
  }
]

const SortProducts = ({
  'data-testid': dataTestId,
  sortBy,
  setQueryParams
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams('sortBy', value)
  }

  return (
    <Select value={sortBy} onValueChange={handleChange}>
      <SelectTrigger className="">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-gray-50">Sort by</SelectLabel>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-x-3 w-full">
                {option.icon}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default SortProducts

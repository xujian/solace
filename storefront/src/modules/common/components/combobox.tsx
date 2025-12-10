'use client'

import { useState } from 'react'
import { Button } from '@lib/components/ui'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@lib/components/ui'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@lib/components/ui/popover'
import { cn } from '@lib/util'
import { Check, ChevronsUpDown, X } from 'lucide-react'

export const title = 'Clear/Reset Button'

export type ComboboxProps = {
  label?: string
  value?: string
  options?: { value: string; label: string }[]
  onChange?: (value: string) => void
  hasSearch?: boolean
}

const Combobox = ({ value, options, onChange, label, hasSearch }: ComboboxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn('w-[200px] justify-between', 
            'text-xs',
            !!value ? 'text-gray-50' : 'text-gray-500')}
          role="combobox"
          variant="outline">
          {value
            ? options?.find(option => option.value === value)?.label
            : label || 'Select...'}
          <div className="ml-2 flex items-center gap-1">
            {value && (
              <a
                className="block rounded-sm hover:bg-amber-700"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange?.('')
                }}>
                <X className="size-4 opacity-50 hover:opacity-100" />
              </a>
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {hasSearch && <CommandInput placeholder="Search..." />}
          <CommandList>
            <CommandEmpty>Empty</CommandEmpty>
            <CommandGroup>
              {options?.map(option => (
                <CommandItem
                  key={option.value}
                  onSelect={currentValue => {
                    onChange?.(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}
                  value={option.value}>
                  <Check
                    className={cn(
                      'mr-2 size-4',
                      value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox

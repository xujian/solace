'use client'

import { Button } from '@lib/components/ui'
import { Input } from '@lib/components/ui'
import { Minus, Plus } from 'lucide-react'

const Quantity = ({
  value,
  onChange
}: {
  value: number
  onChange: (value: number) => void
}) => {

  return (
    <div className="flex items-center h-10 w-25 border rounded justify-between gap-0 bg-muted overflow-hidden">
      <Button
        onClick={() => onChange(Math.max(1, value - 1))}
        size="icon"
        type="button"
        className="square w-8 h-full rounded-none"
        variant="ghost">
        <Minus />
      </Button>
      <Input
        className="w-8 h-full text-center square border-none text-2xl rounded-none focus-visible:outline-none focus-visible:ring-none"
        min="1"
        onChange={e => onChange(Number(e.target.value))}
        type="text"
        readOnly
        value={value}
      />
      <Button
        onClick={() => onChange(value + 1)}
        size="icon"
        type="button"
        className="square w-8 h-full rounded-none"
        variant="ghost">
        <Plus />
      </Button>
    </div>
  )
}

export default Quantity

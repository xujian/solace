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
    <div className="w-full flex gap-1 items-center">
      <Button
        onClick={() => onChange(Math.max(1, value - 1))}
        size="icon"
        type="button"
        variant="ghost">
        <Minus />
      </Button>
      <Input
        className="text-center"
        min="1"
        onChange={e => onChange(Number(e.target.value))}
        type="number"
        value={value}
      />
      <Button
        onClick={() => onChange(value + 1)}
        size="icon"
        type="button"
        variant="ghost">
        <Plus />
      </Button>
    </div>
  )
}

export default Quantity

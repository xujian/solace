import React from 'react'
import { HttpTypes } from '@medusajs/types'
import { cn } from '@lib/util'

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  'data-testid'?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  'data-testid': dataTestId,
  disabled
}) => {
  const filteredOptions = (option.values ?? []).map(v => v.value)

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm">Select {title}</h3>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map(v => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={cn('aspect-square h-12 w-12 rounded text-xs', {
                border: v === current,
                'hover:shadow-elevation-card-rest transition-shadow duration-150 ease-in-out': v !== current
              })}
              disabled={disabled}
              data-testid="option-button">
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect

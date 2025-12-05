import React from 'react'
import { HttpTypes } from '@medusajs/types'
import { cn } from '@lib/util'
import { VariantColor } from 'types/cms'
import Image from 'next/image'

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  colors: VariantColor[]
  'data-testid'?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  colors,
  'data-testid': dataTestId,
  disabled
}) => {
  console.log('<><><><><><><><>colors', colors)
  const filteredOptions = (option.values ?? []).map(v => v.value)
  const matchVariantColor = (v: string) => 
    colors.find((c: VariantColor) => c.name === v)

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm">Select {title}</h3>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map(v => {
          const variantColor = matchVariantColor(v),
            selectedClasses = v === current
              ? 'border-2 border-gray-200'
              : 'border border-gray-500'
          return variantColor?.type === 'image'
            ? (
              <Image
                key={v}
                src={variantColor?.value}
                alt={variantColor?.name}
                width={48}
                height={48}
                className={
                  cn('aspect-square h-12 w-12 rounded', selectedClasses)}
                data-testid="option-button"
                style={{
                  background: variantColor?.value
                }}
                title={variantColor?.name}
                onClick={() => updateOption(option.id, v)}
              />
            )
            : (
              <button
                onClick={() => updateOption(option.id, v)}
                key={v}
                className={
                  cn('aspect-square h-12 w-12 rounded', selectedClasses)
                }
                style={{
                  background: variantColor?.value
                }}
                title={variantColor?.name}
                disabled={disabled}
                data-testid="option-button">
              </button>
            )
        })}
      </div>
    </div>
  )
}

export default OptionSelect

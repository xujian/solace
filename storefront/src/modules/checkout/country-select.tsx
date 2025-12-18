import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { useSession } from '@lib/context/session-context'
import { HttpTypes } from '@medusajs/types'
import { NativeSelect, NativeSelectOption, NativeSelectProps } from '@lib/components/ui'

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(({ placeholder = 'Country', defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)
  const { country, region } = useSession()

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(ref, () => innerRef.current)

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    return region.countries?.map(country => ({
      value: country.iso_2,
      label: country.display_name
    }))
  }, [region])

  return (
    <NativeSelect ref={innerRef} 
      className="w-full border-0"
      placeholder={placeholder} 
      defaultValue={defaultValue} {...props}>
      {countryOptions?.map(({ value, label }, index) => (
        <NativeSelectOption key={index} value={value}>
          {label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = 'CountrySelect'

export default CountrySelect

'use client'
import { useSession } from '@lib/context/session-context'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { HttpTypes } from '@medusajs/types'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@lib/components/ui'
import { updateRegion } from '@lib/data/cart'
import { StateType } from '@lib/hooks/use-toggle-state'

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
}

const CountrySelect = ({ toggleState }: CountrySelectProps) => {
  const { country, region } = useSession()
  const [current, setCurrent] = useState<
    { country: string | undefined; region: string; label: string | undefined } | undefined
  >(undefined)

  const currentPath = usePathname().split(`/${country}`)[1]

  const { state, close } = toggleState

  const options = useMemo(() => {
    return [region]
      ?.map(r => {
        return r?.countries?.map(c => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? '').localeCompare(b?.label ?? ''))
  }, [])

  useEffect(() => {
    if (region) {
      const option = options?.find(o => o?.region === region.id)
      setCurrent(option)
    }
  }, [options, region])

  const handleChange = (value: string) => {
    const option = options?.find(o => o?.country === value)
    if (option) {
      updateRegion(option.country!, currentPath || '/')
      close()
    }
  }

  return (
    <div>
      <Select
        value={country || ''}
        onValueChange={handleChange}
        open={state}
        onOpenChange={open => {
          if (!open) close()
        }}>
        <SelectTrigger className="h-auto w-full border-none p-0 py-1 shadow-none focus:ring-0">
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>Shipping to:</span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{
                    width: '16px',
                    height: '16px'
                  }}
                  countryCode={current.country ?? ''}
                />
                {current.label}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="text-small-regular no-scrollbar rounded-rounded z-[900] max-h-[442px] w-full min-w-[320px] overflow-y-scroll bg-white text-black uppercase drop-shadow-md">
          {options?.map((o, index) => {
            return (
              <SelectItem key={index} value={o?.country ?? ''} className="cursor-pointer px-3 py-2 hover:bg-gray-200">
                <div className="flex items-center gap-x-2">
                  {/* @ts-ignore */}
                  <ReactCountryFlag
                    svg
                    style={{
                      width: '16px',
                      height: '16px'
                    }}
                    countryCode={o?.country ?? ''}
                  />{' '}
                  {o?.label}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

export default CountrySelect

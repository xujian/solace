'use client'

import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import ReactCountryFlag from 'react-country-flag'
import { HttpTypes } from '@medusajs/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@lib/components/ui'
import { updateRegion } from '@lib/data/cart'
import { useSession } from '@lib/context/session-context'

interface CountrySelectProps {
  regions?: HttpTypes.StoreRegion[] | null
  children?: React.ReactNode
}

export const CountryLabel: React.FC = () => {
  const { country: currentCountryCode, region: currentRegion } = useSession()

  const labelData = useMemo(() => {
    if (!currentRegion || !currentCountryCode) return null
    const country = currentRegion.countries?.find(
      c => c.iso_2 === currentCountryCode
    )
    return {
      code: currentCountryCode,
      name: country?.display_name || ''
    }
  }, [currentRegion, currentCountryCode])

  if (!labelData) return null

  return (
    <div className="flex items-center gap-x-2">
      <ReactCountryFlag
        svg
        className="rounded-xs"
        style={{ width: '16px', height: '12px' }}
        countryCode={labelData.code}
      />
      <span className="font-semibold">{labelData.name}</span>
    </div>
  )
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  regions: regionsProp,
  children
}) => {
  const { country: currentCountryCode, region: currentRegion } = useSession()
  const pathname = usePathname()

  const options = useMemo(() => {
    const regionsToUse = regionsProp || (currentRegion ? [currentRegion] : [])

    return regionsToUse
      .flatMap(r =>
        r.countries?.map(c => ({
          country: c.iso_2 || '',
          regionId: r.id,
          label: c.display_name || ''
        })) || []
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regionsProp, currentRegion])

  const handleChange = async (value: string) => {
    const option = options.find(o => o.country === value)
    if (!option) return

    const pathParts = pathname.split('/')
    const pathWithoutCountry = `/${pathParts.slice(2).join('/')}`

    await updateRegion(option.country, pathWithoutCountry)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="group cursor-pointer">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-72 min-w-[240px] rounded border bg-muted p-1 shadow-2xl backdrop-blur-xl">
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Select Region
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(option => (
          <DropdownMenuItem
            key={option.country}
            onClick={() => handleChange(option.country)}
            className="flex cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 text-sm transition-colors">
            <ReactCountryFlag
              svg
              className="rounded-xs"
              style={{ width: '18px', height: '14px' }}
              countryCode={option.country}
            />
            <span className="font-medium">{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CountrySelect

"use client"

import { useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@lib/components/ui"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<
    | { country: string | undefined; region: string; label: string | undefined }
    | undefined
  >(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const { state, close } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        }))
      })
      .flat()
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (value: string) => {
    const option = options?.find((o) => o?.country === value)
    if (option) {
      updateRegion(option.country, currentPath)
      close()
    }
  }

  return (
    <div>
      <Select
        value={(countryCode as string) || ""}
        onValueChange={handleChange}
        open={state}
        onOpenChange={(open) => {
          if (!open) close()
        }}
      >
        <SelectTrigger className="py-1 w-full border-none shadow-none focus:ring-0 p-0 h-auto">
          <div className="txt-compact-small flex items-start gap-x-2">
            <span>Shipping to:</span>
            {current && (
              <span className="txt-compact-small flex items-center gap-x-2">
                {/* @ts-ignore */}
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country ?? ""}
                />
                {current.label}
              </span>
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md text-small-regular uppercase text-black no-scrollbar rounded-rounded w-full min-w-[320px]">
          {options?.map((o, index) => {
            return (
              <SelectItem
                key={index}
                value={o?.country ?? ""}
                className="py-2 hover:bg-gray-200 px-3 cursor-pointer"
              >
                <div className="flex items-center gap-x-2">
                  {/* @ts-ignore */}
                  <ReactCountryFlag
                    svg
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    countryCode={o?.country ?? ""}
                  />{" "}
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

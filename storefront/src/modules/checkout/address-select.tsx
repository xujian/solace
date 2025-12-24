import { ChevronsUpDown } from "lucide-react"
import { cn } from "@lib/util"
import { useMemo, useState } from "react"

import compareAddresses from "@lib/util/compare-addresses"
import { HttpTypes } from "@medusajs/types"
import { Popover, PopoverContent, PopoverTrigger } from "@lib/components/ui"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: HttpTypes.StoreCartAddress | null
  onSelect: (
    address: HttpTypes.StoreCartAddress | undefined,
    email?: string
  ) => void
}

const AddressSelect = ({
  addresses,
  addressInput,
  onSelect,
}: AddressSelectProps) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)
    if (savedAddress) {
      onSelect(savedAddress as HttpTypes.StoreCartAddress)
      setOpen(false)
    }
  }

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, addressInput))
  }, [addresses, addressInput])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            className="relative w-full flex justify-between items-center px-4 py-[10px] text-lef cursor-default focus:outline-none border rounded-md focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-300 text-base"
            data-testid="shipping-address-select"
          >
            <span className="block truncate">
              {selectedAddress
                ? selectedAddress.address_1
                : "Choose an address"}
            </span>
            <ChevronsUpDown
              className={cn("transition-rotate duration-200", {
                "transform rotate-180": open,
              })}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="absolute z-20 w-full overflow-auto text-sm border border-top-0 max-h-60 focus:outline-none sm:text-sm p-0"
          data-testid="shipping-address-options"
          align="start"
          sideOffset={0}
          onInteractOutside={() => setOpen(false)}
        >
          {addresses.map((address) => {
            return (
              <div
                key={address.id}
                className="cursor-default select-none relative pl-6 pr-10 hover:bg-gray-50 py-4"
                data-testid="shipping-address-option"
                onClick={() => handleSelect(address.id)}
              >
                <div className="flex gap-x-4 items-start">
                  <div
                    className={cn(
                      "flex items-center justify-center w-4 h-4 rounded-full border border-primary",
                      {
                        "bg-primary": selectedAddress?.id === address.id,
                      }
                    )}
                    data-testid="shipping-address-radio"
                  >
                    {selectedAddress?.id === address.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-left text-base font-semibold">
                      {address.first_name} {address.last_name}
                    </span>
                    {address.company && (
                      <span className="text-sm text-foreground">
                        {address.company}
                      </span>
                    )}
                    <div className="flex flex-col text-left text-base mt-2">
                      <span>
                        {address.address_1}
                        {address.address_2 && (
                          <span>, {address.address_2}</span>
                        )}
                      </span>
                      <span>
                        {address.postal_code}, {address.city}
                      </span>
                      <span>
                        {address.province && `${address.province}, `}
                        {address.country_code?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </PopoverContent>
      </div>
    </Popover>
  )
}

export default AddressSelect

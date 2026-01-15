'use client'

import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@lib/components/ui'
import useToggleState from '@lib/hooks/use-toggle-state'
import { cn } from '@lib/util'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import CountrySelect, { CountryLabel } from './country-select'
import { ArrowRight, MenuIcon, X } from 'lucide-react'

const SideMenuItems = {
  Home: '/',
  Store: '/store',
  Account: '/account',
  Cart: '/cart'
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <div className="flex items-center h-full">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="nav-button">
            <MenuIcon />
          </Button>
        </PopoverTrigger>
        {popoverOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/0 pointer-events-auto"
            onClick={() => setPopoverOpen(false)}
            data-testid="side-menu-backdrop"
          />
        )}
        <PopoverContent
          className="flex flex-col w-[600px] bg-white absolute p-0 z-50"
          align="start"
          side="bottom"
          sideOffset={0}
          onInteractOutside={e => e.preventDefault()}>
          <div
            data-testid="nav-menu-popup"
            className="flex flex-col rounded-lg bg-muted p-4">
            <div className="flex justify-end" id="xmark">
              <button data-testid="close-menu-button" onClick={() => setPopoverOpen(false)}>
                <X />
              </button>
            </div>
            <ul className="flex flex-col gap-6 items-start justify-start">
              {Object.entries(SideMenuItems).map(([name, href]) => {
                return (
                  <li key={name}>
                    <LocalizedClientLink
                      href={href}
                      className="text-xl leading-4 hover:text-muted-foreground"
                      onClick={() => setPopoverOpen(false)}
                      data-testid={`${name.toLowerCase()}-link`}>
                      {name}
                    </LocalizedClientLink>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-4 px-2 py-2">
            {regions && (
              <CountrySelect regions={regions}>
                <div className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-x-2 text-sm">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Shipping to
                    </span>
                    <CountryLabel />
                  </div>
                  <ArrowRight className="h-4 w-4 transition-transform duration-150 group-data-[state=open]:rotate-90" />
                </div>
              </CountrySelect>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default SideMenu

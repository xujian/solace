"use client"

import { ArrowRightMini, XMark } from "@medusajs/icons"
import { cn } from "@lib/util"
import useToggleState from "@lib/hooks/use-toggle-state"
import { Popover, PopoverContent, PopoverTrigger } from "@lib/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

const SideMenu = ({ regions }: { regions: HttpTypes.StoreRegion[] | null }) => {
  const toggleState = useToggleState()
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              data-testid="nav-menu-button"
              className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
            >
              Menu
            </button>
          </PopoverTrigger>
          
          {popoverOpen && (
            <div
              className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
              onClick={() => setPopoverOpen(false)}
              data-testid="side-menu-backdrop"
            />
          )}

          <PopoverContent
            className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl p-0 border-none"
            align="start"
            side="bottom"
            sideOffset={0}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <div
              data-testid="nav-menu-popup"
              className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6"
            >
              <div className="flex justify-end" id="xmark">
                <button data-testid="close-menu-button" onClick={() => setPopoverOpen(false)}>
                  <XMark />
                </button>
              </div>
              <ul className="flex flex-col gap-6 items-start justify-start">
                {Object.entries(SideMenuItems).map(([name, href]) => {
                  return (
                    <li key={name}>
                      <LocalizedClientLink
                        href={href}
                        className="text-3xl leading-10 hover:text-ui-fg-disabled"
                        onClick={() => setPopoverOpen(false)}
                        data-testid={`${name.toLowerCase()}-link`}
                      >
                        {name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
              <div className="flex flex-col gap-y-6">
                <div
                  className="flex justify-between"
                  onMouseEnter={toggleState.open}
                  onMouseLeave={toggleState.close}
                >
                  {regions && (
                    <CountrySelect
                      toggleState={toggleState}
                      regions={regions}
                    />
                  )}
                  <ArrowRightMini
                    className={cn(
                      "transition-transform duration-150",
                      toggleState.state ? "-rotate-90" : ""
                    )}
                  />
                </div>
                <p className="flex justify-between txt-compact-small">
                  © {new Date().getFullYear()} Medusa Store. All rights
                  reserved.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu

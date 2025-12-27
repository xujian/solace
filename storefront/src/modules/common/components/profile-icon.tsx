'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@lib/components/ui'
import { useSession } from '@lib/context/session-context'
import { signout } from '@lib/data/customer'
import LocalizedClientLink from './localized-client-link'
import { ModeToggle } from './mode-toggle'
import { User as UserIcon } from 'lucide-react'

const ProfileIcon = () => {
  const { country, user } = useSession()

  return (
    <Popover>
      <PopoverTrigger className="relative" asChild>
        <Button variant="ghost" size="icon" className="nav-button">
          <UserIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-1 absolute right-0">
        {user ? (
          <div className="flex flex-col gap-1">
            <LocalizedClientLink
              href="/account">
              <Button className="w-full">My Account</Button>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account/profile">
              <Button className="w-full">Profile</Button>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/account/orders">
              <Button className="w-full">Orders</Button>
            </LocalizedClientLink>
            <Button
              onClick={() => signout(country)}
              className="w-full">
              Sign out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <Link
              href="/login">
              <Button className="w-full">Sign in</Button>
            </Link>
            <LocalizedClientLink
              href="/account?mode=signup">
              <Button className="w-full">Sign up</Button>
            </LocalizedClientLink>
          </div>
        )}
        <div className="my-1 h-px bg-muted" />
        <ModeToggle />
      </PopoverContent>
    </Popover>
  )
}

export default ProfileIcon

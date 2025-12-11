'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@lib/components/ui'
import { cn } from '@lib/util'
import { ModeToggle } from './mode-toggle'
import { signout } from '@lib/data/customer'
import { ChevronDown, User as UserIcon } from 'lucide-react'
import LocalizedClientLink from './localized-client-link'
import { useSession } from '@lib/context/session-context'

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { country } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          onClick={toggleDropdown}
          size="icon"
          className="bg-dark"
          aria-expanded={isOpen}
          aria-haspopup="menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <LocalizedClientLink href="/account">My Account</LocalizedClientLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LocalizedClientLink href="/account/profile">Profile</LocalizedClientLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LocalizedClientLink href="/account/orders">Orders</LocalizedClientLink>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a onClick={() => signout(country)}>Sign out</a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ModeToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileIcon

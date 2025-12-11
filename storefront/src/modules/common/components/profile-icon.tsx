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
import { useSession } from '@lib/context/session-context'
import { signout } from '@lib/data/customer'
import { cn } from '@lib/util'
import LocalizedClientLink from './localized-client-link'
import { ModeToggle } from './mode-toggle'
import { ChevronDown, User as UserIcon } from 'lucide-react'

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { country, user } = useSession()
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
          variant="ghost"
          aria-expanded={isOpen}
          aria-haspopup="menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {user ? (
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem>
              <LocalizedClientLink href="/account">
                My Account
              </LocalizedClientLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LocalizedClientLink href="/account/profile">
                Profile
              </LocalizedClientLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LocalizedClientLink href="/account/orders">
                Orders
              </LocalizedClientLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a onClick={() => signout(country)}>Sign out</a>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <DropdownMenuGroup className="flex flex-col gap-1">
            <DropdownMenuItem className="bg-primary">
              <LocalizedClientLink className='w-full' href="/account?mode=signin">
                Sign in
              </LocalizedClientLink>
            </DropdownMenuItem>
            <DropdownMenuItem className="bg-primary">
              <LocalizedClientLink className='w-full' href="/account?mode=signup">
                Sign up
              </LocalizedClientLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <ModeToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileIcon

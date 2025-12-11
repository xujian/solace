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
          className="bg-dark"
          aria-expanded={isOpen}
          aria-haspopup="menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {user ? (
          <DropdownMenuGroup>
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
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LocalizedClientLink className='w-full' href="/account?mode=signin">
                <Button className="w-full">Sign in</Button>
              </LocalizedClientLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LocalizedClientLink className='w-full' href="/account?mode=signup">
                <Button className="w-full">Sign up</Button>
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

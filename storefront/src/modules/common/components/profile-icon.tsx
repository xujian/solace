'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, User as UserIcon } from 'lucide-react'
import { cn } from '@lib/util'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger } from '@lib/components/ui'
import { ModeToggle } from './mode-toggle'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          className="bg-dark text-ui-fg-base hover:bg-ui-bg-hover"
          aria-expanded={isOpen}
          aria-haspopup="menu">
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-popover text-popover-foreground" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>My Orders</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Logout</DropdownMenuLabel>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <ModeToggle />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> 
  )
}

export default ProfileIcon

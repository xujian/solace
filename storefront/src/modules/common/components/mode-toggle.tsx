'use client'

import { useTheme } from 'next-themes'
import * as React from 'react'
import { ToggleGroup, ToggleGroupItem } from '@lib/components/ui'
import { Monitor, Moon, Sun } from 'lucide-react'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <ToggleGroup type="single" value={theme} onValueChange={setTheme}>
      <ToggleGroupItem value="light" aria-label="Light mode">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode">
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System mode">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

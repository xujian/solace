'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ComponentType
} from 'react'
import { Dialog, DialogContent } from '@lib/components/ui/dialog'
import { Drawer, DrawerContent } from '@lib/components/ui/drawer'
import { Sheet, SheetContent } from '@lib/components/ui/sheet'
import { toast as sonner } from 'sonner'

interface BaseInteractiveConfig {
  dismissible?: boolean
  className?: string
}

interface SheetConfig extends BaseInteractiveConfig {}

interface DrawerConfig extends BaseInteractiveConfig {}

interface DialogConfig extends BaseInteractiveConfig {
  center?: boolean
}

interface ToastOptions extends BaseInteractiveConfig {
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

interface InteractiveContext {
  sheet: <T extends object>(
    Component: ComponentType<T>,
    props: T,
    config?: SheetConfig
  ) => void
  drawer: <T extends object>(
    Component: ComponentType<T>,
    props: T,
    config?: DrawerConfig
  ) => void
  dialog: <T extends object>(
    Component: ComponentType<T>,
    props: T,
    config?: DialogConfig
  ) => void
  toast: (message: string, config?: ToastOptions) => void
  close: () => void
}

const InteractiveContext = createContext<InteractiveContext | null>(null)

interface InteractiveProviderProps {
  children: ReactNode
}

type OverlayType = 'sheet' | 'drawer' | 'dialog'

interface OverlayState {
  type: OverlayType
  Component: ComponentType<any>
  props?: any
  config?: SheetConfig | DrawerConfig | DialogConfig
}

export const InteractiveProvider = ({ children }: InteractiveProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [overlayState, setOverlayState] = useState<OverlayState | null>(null)

  const sheet = <T extends object>(
    Component: ComponentType<T>,
    props?: T,
    config?: SheetConfig
  ) => {
    setOverlayState({ type: 'sheet', Component, props, config })
    setIsOpen(true)
  }

  const drawer = <T extends object>(
    Component: ComponentType<T>,
    props?: T,
    config?: DrawerConfig
  ) => {
    setOverlayState({ type: 'drawer', Component, props, config })
    setIsOpen(true)
  }

  const dialog = <T extends object>(
    Component: ComponentType<T>,
    props?: T,
    config?: DialogConfig
  ) => {
    setOverlayState({ type: 'dialog', Component, props, config })
    setIsOpen(true)
  }

  const toast = (message: string, config?: ToastOptions) => {
    const type = config?.type || 'info'
    switch (type) {
      case 'success':
        sonner.success(message, config)
        break
      case 'warning':
        sonner.warning(message, config)
        break
      case 'error':
        sonner.error(message, config)
        break
      default:
        sonner.info(message, config)
        break
    }
  }

  const close = () => {
    setIsOpen(false)
  }

  const { type, Component, props, config } = overlayState || {}

  // Helper to handle dismissal prevention for Radix (Sheet/Dialog)
  const handleInteractOutside = (e: Event) => {
    if (config?.dismissible === false) {
      e.preventDefault()
    }
  }

  const handleEscapeKeyDown = (e: KeyboardEvent) => {
    if (config?.dismissible === false) {
      e.preventDefault()
    }
  }

  // Helper for Vaul (Drawer) dismissal
  const isDismissible = config?.dismissible !== false

  return (
    <InteractiveContext.Provider value={{ sheet, drawer, dialog, toast, close }}>
      {children}
      <Sheet open={isOpen && type === 'sheet'} onOpenChange={setIsOpen}>
        <SheetContent
          side={'right'}
          className={config?.className}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}>
          {type === 'sheet' && Component && <Component {...props} />}
        </SheetContent>
      </Sheet>
      <Drawer
        open={isOpen && type === 'drawer'}
        onOpenChange={setIsOpen}
        dismissible={isDismissible}>
        <DrawerContent className={config?.className}>
          {type === 'drawer' && Component && <Component {...props} />}
        </DrawerContent>
      </Drawer>
      <Dialog open={isOpen && type === 'dialog'} onOpenChange={setIsOpen}>
        <DialogContent
          className={config?.className}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}>
          {type === 'dialog' && Component && <Component {...props} />}
        </DialogContent>
      </Dialog>
    </InteractiveContext.Provider>
  )
}

/**
 * @description call this hook to open an interactive component
 * @usage
 * const $ = useInteractive()
 * $.sheet(<Component>, {})
 * $.drawer()
 * $.dialog()
 * @returns
 */
export const useInteractive = () => {
  const context = useContext(InteractiveContext)
  if (!context) {
    throw new Error('useInteractive must be used within a InteractiveProvider')
  }
  return context
}

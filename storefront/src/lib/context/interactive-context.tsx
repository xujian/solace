'use client'

import { Button } from '@lib/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@lib/components/ui/dialog'
import { Drawer, DrawerContent } from '@lib/components/ui/drawer'
import { Sheet, SheetContent } from '@lib/components/ui/sheet'
import { DialogTitle } from '@radix-ui/react-dialog'
import {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'
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

interface ConfirmConfig extends DialogConfig {
  title?: string
  cancelText?: string
  okText?: string
  variant?: 'destructive' | 'default'
  onOk?: () => void
  onCancel?: () => void
}

interface ToastOptions extends BaseInteractiveConfig {
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

export type InteractiveContentProps = {
  onCancel?: () => void
  onOk?: () => void
}

export type MakeInteractiveContent<T extends object> = T &
  InteractiveContentProps
/*
 * Comppnents that embed into interactive overlays
 **/
export type InteractiveContent<T extends object> = ComponentType<T>

interface InteractiveContext {
  sheet: <T extends object>(
    Component: InteractiveContent<T>,
    props?: T,
    config?: SheetConfig
  ) => void
  drawer: <T extends object>(
    Component: InteractiveContent<T>,
    props?: T,
    config?: DrawerConfig
  ) => void
  dialog: <T extends object>(
    Component: InteractiveContent<T>,
    props?: T,
    config?: DialogConfig
  ) => void
  confirm: (
    message: string | ReactNode,
    config?: ConfirmConfig
  ) => Promise<boolean> | void
  toast: (message: string, config?: ToastOptions) => void
  clear: () => void
}

const InteractiveContext = createContext<InteractiveContext | null>(null)

interface InteractiveProviderProps {
  children: ReactNode
}

type OverlayType = 'sheet' | 'drawer' | 'dialog'

interface OverlayState {
  type: OverlayType
  Component: InteractiveContent<any>
  props?: any
  config?: SheetConfig | DrawerConfig | DialogConfig
}

const Confirmation: InteractiveContent<{
  description: string | ReactNode
  title: string
  okText: string
  cancelText: string
  variant: 'destructive' | 'default'
} & InteractiveContentProps> = ({
  description,
  title,
  cancelText,
  okText,
  variant,
  onOk,
  onCancel,
}) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onOk}>
          {okText}
        </Button>
      </DialogFooter>
    </>
  )
}

export const InteractiveProvider = ({ children }: InteractiveProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [overlayState, setOverlayState] = useState<OverlayState | null>(null)

  /**
   * opens a sheet (from side)
   * @param Component 
   * @param props 
   * @param config 
   */
  const sheet = <T extends object>(
    Component: InteractiveContent<T>,
    props?: T,
    config?: SheetConfig
  ) => {
    setOverlayState({ type: 'sheet', Component, props, config })
    setIsOpen(true)
  }

  /**
   * opens a drawer (from below)
   * @param Component 
   * @param props 
   * @param config 
   */
  const drawer = <T extends object>(
    Component: InteractiveContent<T>,
    props?: T,
    config?: DrawerConfig
  ) => {
    setOverlayState({ type: 'drawer', Component, props, config })
    setIsOpen(true)
  }

  /**
   * opens a dialog (always centered)
   * @param Component 
   * @param props 
   * @param config 
   */
  const dialog = <T extends object>(
    Component: InteractiveContent<T>,
    props?: T,
    config?: DialogConfig
  ) => {
    setOverlayState({ type: 'dialog', Component, props, config })
    setIsOpen(true)
  }

  /**
   * opens a confirmation dialog 
   * @param message 
   * @param config 
   * @returns 
   */
  const confirm = (
    message: string | ReactNode,
    config?: ConfirmConfig
  ): Promise<boolean> | void => {
    if (config?.onOk) {
      dialog(
        Confirmation,
        {
          description: message,
          title: config?.title || 'Confirm',
          cancelText: config?.cancelText || 'Cancel',
          okText: config?.okText || 'OK',
          variant: config?.variant || 'default',
          onOk: config?.onOk,
          onCancel: config?.onCancel,
        },
        config
      )
      return
    }
    return new Promise<boolean>((resolve) => {
      dialog(
        Confirmation,
        {
          description: message,
          title: config?.title || 'Confirm',
          cancelText: config?.cancelText || 'Cancel',
          okText: config?.okText || 'OK',
          variant: config?.variant || 'default',
          onOk: () => resolve(true),
          onCancel: () => {
            config?.onCancel?.()
            resolve(false)
          },
        },
        config
      )
    })
  }

  /**
   * opens a toast
   * @param message 
   * @param config 
   */
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

  /**
   * close all the overlays
   */
  const clear = () => {
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

  const onOk = () => {
    clear()
    props?.onOk?.()
  }

  const onCancel = () => {
    clear()
    props?.onCancel?.()
  }

  // Helper for Vaul (Drawer) dismissal
  const isDismissible = config?.dismissible !== false

  return (
    <InteractiveContext.Provider
      value={{ sheet, drawer, dialog, confirm, toast, clear }}>
      {children}
      <Sheet open={isOpen && type === 'sheet'} onOpenChange={setIsOpen}>
        <SheetContent
          side={'right'}
          className={config?.className}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}>
          {type === 'sheet' && Component && (
            <Component {...props} onCancel={onCancel} onOk={onOk} />
          )}
        </SheetContent>
      </Sheet>
      <Drawer
        open={isOpen && type === 'drawer'}
        onOpenChange={setIsOpen}
        dismissible={isDismissible}>
        <DrawerContent className={config?.className}>
          {type === 'drawer' && Component && (
            <Component {...props} onCancel={onCancel} onOk={onOk} />
          )}
        </DrawerContent>
      </Drawer>
      <Dialog open={isOpen && type === 'dialog'} onOpenChange={setIsOpen}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogContent
          className={config?.className}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}>
          {type === 'dialog' && Component && (
            <Component {...props} onCancel={onCancel} onOk={onOk} />
          )}
        </DialogContent>
      </Dialog>
    </InteractiveContext.Provider>
  )
}

/**
 * @description call this hook to open an interactive component
 * @usage
 * const $ = useInteractive()
 * $.sheet(<Component>, props, config)
 * $.drawer(<Component>, props, config)
 * $.dialog(<Component>, props, config)
 * $.confirm("Are you sure?", config)
 * @returns
 */
export const useInteractive = () => {
  const context = useContext(InteractiveContext)
  if (!context) {
    throw new Error('useInteractive must be used within a InteractiveProvider')
  }
  return context
}

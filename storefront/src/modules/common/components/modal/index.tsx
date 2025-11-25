import React from "react"
import { cn } from "@lib/util"

import { ModalProvider, useModal } from "@lib/context/modal-context"
import X from "@modules/common/icons/x"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@lib/components/ui"

type ModalProps = {
  isOpen: boolean
  close: () => void
  size?: "small" | "medium" | "large"
  search?: boolean
  children: React.ReactNode
  'data-testid'?: string
}

const Modal = ({
  isOpen,
  close,
  size = "medium",
  search = false,
  children,
  'data-testid': dataTestId
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        data-testid={dataTestId}
        className={cn(
          "flex flex-col justify-start w-full p-5 max-h-[75vh] h-fit overflow-y-auto",
          {
            "max-w-md": size === "small",
            "max-w-xl": size === "medium",
            "max-w-3xl": size === "large",
            "bg-transparent shadow-none border-none": search,
            "bg-white shadow-xl border rounded-rounded": !search,
          }
        )}
        onInteractOutside={close}
      >
        <ModalProvider close={close}>{children}</ModalProvider>
      </DialogContent>
    </Dialog>
  )
}

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { close } = useModal()

  return (
    <DialogHeader className="flex items-center justify-between flex-row">
      <DialogTitle className="text-large-semi">{children}</DialogTitle>
      <button onClick={close} data-testid="close-modal-button">
        <X size={20} />
      </button>
    </DialogHeader>
  )
}

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DialogDescription className="flex text-small-regular text-ui-fg-base items-center justify-center pt-2 pb-4 h-full">
      {children}
    </DialogDescription>
  )
}

const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex justify-center">{children}</div>
}

const Footer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex items-center justify-end gap-x-4">{children}</div>
}

Modal.Title = Title
Modal.Description = Description
Modal.Body = Body
Modal.Footer = Footer

export default Modal

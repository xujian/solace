'use client'
import { useEffect, useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@lib/components/ui'
import { addAddress } from '@lib/data/customer'
import useToggleState from '@lib/hooks/use-toggle-state'
import { Plus } from 'lucide-react'
import { DialogTrigger } from '@radix-ui/react-dialog'
import AddressForm from './components/address-form'

const AddAddress = ({ addresses }: { addresses: HttpTypes.StoreCustomerAddress[] }) => {
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)
  const router = useRouter()

  const [formState, formAction, isPending] = useActionState(addAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
      router.refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  return (
    <Dialog open={state} onOpenChange={(open) => !open && close()}>
      <DialogTrigger asChild>
        <Button onClick={open} data-testid="add-address-button">
          <Plus /> New address
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0" data-testid="add-address-modal">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
          <DialogTitle className="text-3xl-regular">Add address</DialogTitle>
        </DialogHeader>
        <AddressForm
          formAction={formAction}
          formState={formState}
          isPending={isPending}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddAddress

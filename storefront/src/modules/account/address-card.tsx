'use client'

import React, { useActionState, useEffect, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@lib/components/ui'
import { deleteAddress, updateAddress } from '@lib/data/customer'
import useToggleState from '@lib/hooks/use-toggle-state'
import { cn } from '@lib/util'
import AddressForm from './address-form'
import {
  Edit,
  MoreVertical,
  LoaderCircle as Spinner,
  Trash2 as Trash
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type EditAddressProps = {
  data: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const AddressCard: React.FC<EditAddressProps> = ({
  data,
  isActive = false
}) => {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction, isPending] = useActionState(updateAddress, {
    success: false,
    error: null,
    addressId: data.id
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteAddress(data.id)
    setRemoving(false)
    router.refresh()
  }

  return (
    <>
      <Card
        className={cn('address-card h-full w-full transition-colors')}
        data-testid="address-card">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex flex-col gap-1.5">
            <CardTitle data-testid="address-name">
              {data.first_name} {data.last_name}
            </CardTitle>
            {data.company && (
              <CardDescription data-testid="address-company">
                {data.company}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={open}
                data-testid="address-edit-button">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={e => {
                  e.preventDefault()
                  removeAddress()
                }}
                data-testid="address-delete-button">
                {removing ? (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="text-base flex flex-col text-left">
          <span data-testid="address-address">
            {data.address_1}
            {data.address_2 && <span>, {data.address_2}</span>}
          </span>
          <span data-testid="address-postal-city">
            {data.postal_code}, {data.city}
          </span>
          <span data-testid="address-province-country">
            {data.province && `${data.province}, `}
            {data.country_code?.toUpperCase()}
          </span>
        </CardContent>
      </Card>
      <Dialog open={state} onOpenChange={open => !open && close()}>
        <DialogContent
          className="max-w-3xl p-0"
          data-testid="edit-address-modal">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <DialogTitle className="text-3xl">Edit address</DialogTitle>
          </DialogHeader>
          <AddressForm
            formAction={formAction}
            formState={formState}
            isPending={isPending}
            onCancel={close}
            defaultValues={data}>
            <input type="hidden" name="addressId" value={data.id} />
          </AddressForm>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddressCard

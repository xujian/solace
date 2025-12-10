'use client'

import React, { useEffect, useState, useActionState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from '@lib/components/ui'
import { Input, Label } from '@lib/components/ui'
import { deleteCustomerAddress, updateCustomerAddress } from '@lib/data/customer'
import useToggleState from '@lib/hooks/use-toggle-state'
import { cn } from '@lib/util'
import { useSession } from '@lib/context/session-context'
import CountrySelect from '@modules/checkout/country-select'
import { Edit, Trash2 as Trash } from 'lucide-react'
import { X } from 'lucide-react'
import { RefreshCw as Spinner } from 'lucide-react'

type EditAddressProps = {
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({ address, isActive = false }) => {
  const { country } = useSession()
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction, isPending] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id
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
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={cn(
          'rounded-rounded flex h-full min-h-[220px] w-full flex-col justify-between border p-5 transition-colors',
          {
            'border-gray-900': isActive
          }
        )}
        data-testid="address-container">
        <div className="flex flex-col">
          <h3 className="text-base-semi text-left" data-testid="address-name">
            {address.first_name} {address.last_name}
          </h3>
          {address.company && (
            <p className="txt-compact-small text-ui-fg-base" data-testid="address-company">
              {address.company}
            </p>
          )}
          <div className="text-base-regular mt-2 flex flex-col text-left">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-x-4">
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={open}
            data-testid="address-edit-button">
            <Edit />
            Edit
          </button>
          <button
            className="text-small-regular text-ui-fg-base flex items-center gap-x-2"
            onClick={removeAddress}
            data-testid="address-delete-button">
            {removing ? <Spinner /> : <Trash />}
            Remove
          </button>
        </div>
      </div>

      <Dialog open={state} onOpenChange={open => !open && close()}>
        <DialogContent className="max-w-3xl p-0" data-testid="edit-address-modal">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <DialogTitle className="text-3xl-regular">Edit address</DialogTitle>
            <button onClick={close} data-testid="close-modal-button">
              <X size={20} />
            </button>
          </DialogHeader>
          <form action={formAction} className="px-6 pb-6">
            <input type="hidden" name="addressId" value={address.id} />
            <div className="grid grid-cols-1 gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />
              <CountrySelect
                name="country_code"
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && <div className="text-small-regular py-2 text-rose-500">{formState.error}</div>}
            <div className="mt-6 flex gap-3">
              <Button type="reset" variant="secondary" onClick={close} className="h-10" data-testid="cancel-button">
                Cancel
              </Button>
              <Button data-testid="save-button" type="submit" isLoading={isPending}>
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditAddress

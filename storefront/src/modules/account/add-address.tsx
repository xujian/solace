'use client'
import { useEffect, useState, useActionState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@lib/components/ui'
import { Input, Field, FieldLabel } from '@lib/components/ui'
import { addCustomerAddress } from '@lib/data/customer'
import useToggleState from '@lib/hooks/use-toggle-state'
import { useSession } from '@lib/context/session-context'
import CountrySelect from '@modules/checkout/country-select'
import { Plus } from 'lucide-react'
import { X } from 'lucide-react'
import { DialogTrigger } from '@radix-ui/react-dialog'

const AddAddress = ({ addresses }: { addresses: HttpTypes.StoreCustomerAddress[] }) => {
  const { country } = useSession()
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction, isPending] = useActionState(addCustomerAddress, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null
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

  return (
      <Dialog open={state} onOpenChange={open => !open && close()}>
        <DialogTrigger asChild>
          <Button onClick={open} data-testid="add-address-button">
            <Plus />New address
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-hidden p-0" data-testid="add-address-modal">
          <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <DialogTitle className="text-3xl-regular">Add address</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="px-6 pb-6" data-lpignore="true" autoComplete='off'>
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Field>
                  <FieldLabel>First name</FieldLabel>
                  <Input
                    name="first_name"
                    required
                    autoComplete="given-name"
                    data-testid="first-name-input"
                  />
                </Field>
                <Field>
                  <FieldLabel>Last name</FieldLabel>
                  <Input
                    name="last_name"
                    required
                    autoComplete="family-name"
                    data-testid="last-name-input"
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>Company</FieldLabel>
                <Input name="company" autoComplete="organization" data-testid="company-input" />
              </Field>
              <Field>
                <FieldLabel>Address</FieldLabel>
                <Input
                  name="address_1"
                  required
                  autoComplete="address-line1"
                  data-testid="address-1-input"
                />
              </Field>
              <Field>
                <FieldLabel>Apartment, suite, etc.</FieldLabel>
                <Input
                  name="address_2"
                  autoComplete="address-line2"
                  data-testid="address-2-input"
                />
              </Field>
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Field>
                  <FieldLabel>Postal code</FieldLabel>
                  <Input
                    name="postal_code"
                    required
                    autoComplete="postal-code"
                    data-testid="postal-code-input"
                  />
                </Field>
                <Field>
                  <FieldLabel>City</FieldLabel>
                  <Input name="city" required autoComplete="locality" data-testid="city-input" />
                </Field>
              </div>
              <Field>
                <FieldLabel>Province / State</FieldLabel>
                <Input name="province" autoComplete="address-level1" data-testid="state-input" />
              </Field>
              <Field>
                <FieldLabel>Country</FieldLabel>
                <CountrySelect
                  name="country_code"
                  required
                  autoComplete="country"
                  data-testid="country-select"
                />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input name="phone" autoComplete="phone" data-testid="phone-input" />
              </Field>
            </div>
            {formState.error && (
              <div className="text-small-regular py-2 text-rose-500" data-testid="address-error">
                {formState.error}
              </div>
            )}
          </form>
          <DialogFooter className='p-4 bg-muted'>
            <Button type="reset" variant="secondary" onClick={close} className="h-10" data-testid="cancel-button">
              Cancel
            </Button>
            <Button data-testid="save-button" type="submit" isLoading={isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default AddAddress

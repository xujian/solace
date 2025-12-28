import React, { useActionState, useEffect } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, Field, FieldLabel, Input } from '@lib/components/ui'
import { addAddress, updateAddress } from '@lib/data/customer'
import { MakeInteractiveContentProps } from '@arsbreeze/interactive'
import addresses from '@modules/checkout/addresses'
import CountrySelect from '@modules/checkout/country-select'

type AddressFormProps = MakeInteractiveContentProps<{
  defaultValues?: HttpTypes.StoreCustomerAddress
  children?: React.ReactNode
}>

/**
 * form to edit for add an address
 * @returns
 */
const AddressForm = ({
  onComplete,
  onAbort,
  defaultValues,
  children
}: AddressFormProps) => {
  const action = defaultValues?.id ? updateAddress : addAddress

  const [formState, formAction, isPending] = useActionState(action, {
    isDefaultShipping: addresses.length === 0,
    success: false,
    error: null
  })

  useEffect(() => {
    if (formState.success) {
      onComplete?.()
    }
  }, [formState.success])

  return (
    <form action={formAction} data-lpignore="true" autoComplete="off">
      {children}
      <div className="flex flex-col gap-y-2 px-6 pb-6">
        <div className="grid grid-cols-2 gap-x-2">
          <Field>
            <FieldLabel>First name</FieldLabel>
            <Input
              name="first_name"
              required
              autoComplete="given-name"
              defaultValue={defaultValues?.first_name || undefined}
              data-testid="first-name-input"
            />
          </Field>
          <Field>
            <FieldLabel>Last name</FieldLabel>
            <Input
              name="last_name"
              required
              autoComplete="family-name"
              defaultValue={defaultValues?.last_name || undefined}
              data-testid="last-name-input"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Company</FieldLabel>
          <Input
            name="company"
            autoComplete="organization"
            defaultValue={defaultValues?.company || undefined}
            data-testid="company-input"
          />
        </Field>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Input
            name="address_1"
            required
            autoComplete="address-line1"
            defaultValue={defaultValues?.address_1 || undefined}
            data-testid="address-1-input"
          />
        </Field>
        <Field>
          <FieldLabel>Apartment, suite, etc.</FieldLabel>
          <Input
            name="address_2"
            autoComplete="address-line2"
            defaultValue={defaultValues?.address_2 || undefined}
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
              defaultValue={defaultValues?.postal_code || undefined}
              data-testid="postal-code-input"
            />
          </Field>
          <Field>
            <FieldLabel>City</FieldLabel>
            <Input
              name="city"
              required
              autoComplete="locality"
              defaultValue={defaultValues?.city || undefined}
              data-testid="city-input"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel>Province / State</FieldLabel>
          <Input
            name="province"
            autoComplete="address-level1"
            defaultValue={defaultValues?.province || undefined}
            data-testid="state-input"
          />
        </Field>
        <Field>
          <FieldLabel>Country</FieldLabel>
          <CountrySelect
            name="country_code"
            required
            autoComplete="country"
            defaultValue={defaultValues?.country_code || undefined}
            data-testid="country-select"
          />
        </Field>
        <Field>
          <FieldLabel>Phone</FieldLabel>
          <Input
            name="phone"
            autoComplete="phone"
            defaultValue={defaultValues?.phone || undefined}
            data-testid="phone-input"
          />
        </Field>
        {defaultValues?.id && (
          <input type="hidden" name="addressId" value={defaultValues.id} />
        )}
        {formState.error && (
          <div
            className="py-2 text-sm text-rose-500"
            data-testid="address-error">
            {formState.error}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="reset"
          variant="secondary"
          onClick={onAbort}
          className="h-10"
          data-testid="cancel-button">
          Cancel
        </Button>
        <Button data-testid="save-button" type="submit" isLoading={isPending}>
          Save
        </Button>
      </div>
    </form>
  )
}

export default AddressForm

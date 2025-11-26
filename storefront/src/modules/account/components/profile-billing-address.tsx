"use client"

import React, { useEffect, useMemo, useActionState } from "react"

import { Input, Label } from "@lib/components/ui"
import NativeSelect from "@modules/common/components/native-select"

import AccountInfo from "./account-info"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  const regionOptions = useMemo(() => {
    return (
      regions
        ?.map((region) => {
          return region.countries?.map((country) => ({
            value: country.iso_2,
            label: country.display_name,
          }))
        })
        .flat() || []
    )
  }, [regions])

  const [successState, setSuccessState] = React.useState(false)

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  const initialState: Record<string, any> = {
    isDefaultBilling: true,
    isDefaultShipping: false,
    error: false,
    success: false,
  }

  if (billingAddress) {
    initialState.addressId = billingAddress.id
  }

  const [state, formAction] = useActionState(
    billingAddress ? updateCustomerAddress : addCustomerAddress,
    initialState
  )

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "No billing address"
    }

    const country =
      regionOptions?.find(
        (country) => country?.value === billingAddress.country_code
      )?.label || billingAddress.country_code?.toUpperCase()

    return (
      <div className="flex flex-col font-semibold" data-testid="current-info">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        <span>{billingAddress.company}</span>
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>{country}</span>
      </div>
    )
  }, [billingAddress, regionOptions])

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <input type="hidden" name="addressId" value={billingAddress?.id} />
      <AccountInfo
        label="Billing address"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state.error}
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="First name"
                defaultValue={billingAddress?.first_name || undefined}
                required
                data-testid="billing-first-name-input"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="Last name"
                defaultValue={billingAddress?.last_name || undefined}
                required
                data-testid="billing-last-name-input"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              placeholder="Company"
              defaultValue={billingAddress?.company || undefined}
              data-testid="billing-company-input"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone"
              autoComplete="tel"
              required
              defaultValue={billingAddress?.phone ?? customer?.phone ?? ""}
              data-testid="billing-phone-input"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="address_1">Address</Label>
            <Input
              id="address_1"
              name="address_1"
              placeholder="Address"
              defaultValue={billingAddress?.address_1 || undefined}
              required
              data-testid="billing-address-1-input"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="address_2">Apartment, suite, etc.</Label>
            <Input
              id="address_2"
              name="address_2"
              placeholder="Apartment, suite, etc."
              defaultValue={billingAddress?.address_2 || undefined}
              data-testid="billing-address-2-input"
            />
          </div>
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="postal_code">Postal code</Label>
              <Input
                id="postal_code"
                name="postal_code"
                placeholder="Postal code"
                defaultValue={billingAddress?.postal_code || undefined}
                required
                data-testid="billing-postcal-code-input"
              />
            </div>
            <div className="flex flex-col gap-y-1">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                defaultValue={billingAddress?.city || undefined}
                required
                data-testid="billing-city-input"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="province">Province</Label>
            <Input
              id="province"
              name="province"
              placeholder="Province"
              defaultValue={billingAddress?.province || undefined}
              data-testid="billing-province-input"
            />
          </div>
          <NativeSelect
            name="country_code"
            defaultValue={billingAddress?.country_code || undefined}
            required
            data-testid="billing-country-code-select"
          >
            <option value="">-</option>
            {regionOptions.map((option, i) => {
              return (
                <option key={i} value={option?.value}>
                  {option?.label}
                </option>
              )
            })}
          </NativeSelect>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileBillingAddress

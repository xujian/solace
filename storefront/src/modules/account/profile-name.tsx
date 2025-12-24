'use client'

import React, { useEffect, useActionState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Input, Label } from '@lib/components/ui'
import { updateCustomer } from '@lib/data/customer'
import ProfileFormContainer from './profile-form-wrapper'

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileName: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  const updateCustomerName = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const customer = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string
    }

    try {
      await updateCustomer(customer)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction] = useActionState(updateCustomerName, {
    error: false,
    success: false
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  return (
    <form action={formAction} className="w-full overflow-visible">
      <ProfileFormContainer
        isSuccess={successState}
        isError={!!state?.error}
        clearState={clearState}
        data-testid="account-name-editor">
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="First name"
              required
              defaultValue={customer.first_name ?? ''}
              data-testid="first-name-input"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Last name"
              required
              defaultValue={customer.last_name ?? ''}
              data-testid="last-name-input"
            />
          </div>
        </div>
      </ProfileFormContainer>
    </form>
  )
}

export default ProfileName

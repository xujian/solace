'use client'

import React, { useEffect, useActionState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Input, Label } from '@lib/components/ui'
import ProfileFormContainer from './profile-form-wrapper'

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  // TODO: It seems we don't support updating emails now?
  const updateCustomerEmail = (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    const customer = {
      email: formData.get('email') as string
    }
    try {
      // await updateCustomer(customer)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction] = useActionState(updateCustomerEmail, {
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
    <form action={formAction} className="w-full">
      <ProfileFormContainer
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-email-editor">
        <div className="grid grid-cols-1 gap-y-2">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              defaultValue={customer.email}
              data-testid="email-input"
            />
          </div>
        </div>
      </ProfileFormContainer>
    </form>
  )
}

export default ProfileEmail

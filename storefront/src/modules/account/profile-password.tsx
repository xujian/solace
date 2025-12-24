'use client'

import React, { useEffect, useActionState } from 'react'
import { toast } from 'sonner'
import { HttpTypes } from '@medusajs/types'
import { Input, Label } from '@lib/components/ui'
import ProfileFormContainer from './profile-form-wrapper'

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfilePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = React.useState(false)

  // TODO: Add support for password updates
  const updatePassword = async () => {
    toast.info('Password update is not implemented')
  }

  const clearState = () => {
    setSuccessState(false)
  }

  return (
    <form
      action={updatePassword}
      onReset={() => clearState()}
      className="w-full">
      <ProfileFormContainer
        isSuccess={successState}
        isError={false}
        errorMessage={undefined}
        clearState={clearState}
        data-testid="account-password-editor">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="old_password">Old password</Label>
            <Input
              id="old_password"
              name="old_password"
              type="password"
              placeholder="Old password"
              required
              data-testid="old-password-input"
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              placeholder="New password"
              required
              data-testid="new-password-input"
            />
          </div>
          <div className="col-span-2 flex flex-col gap-y-1">
            <Label htmlFor="confirm_password">Confirm password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Confirm password"
              required
              data-testid="confirm-password-input"
            />
          </div>
        </div>
      </ProfileFormContainer>
    </form>
  )
}

export default ProfilePassword

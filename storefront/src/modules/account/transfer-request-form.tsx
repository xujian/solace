'use client'

import { useActionState } from 'react'
import { useEffect, useState } from 'react'
import { Button, Input } from '@lib/components/ui'
import { createTransferRequest } from '@lib/data/orders'
import { CheckCircle, XCircle } from 'lucide-react'

export default function TransferRequestForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const [state, formAction, isPending] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null
  })

  useEffect(() => {
    if (state.success && state.order) {
      setShowSuccess(true)
    }
  }, [state.success, state.order])

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="grid w-full items-center gap-x-8 gap-y-4 sm:grid-cols-2">
        <div className="flex flex-col gap-y-1">
          <h3>Order transfers</h3>
          <p className="text-muted-foreground text-sm">
            Can&apos;t find the order you are looking for?
            <br /> Connect an order to your account.
          </p>
        </div>
        <form
          action={formAction}
          className="flex flex-col gap-y-1 sm:items-end">
          <div className="flex w-full flex-col gap-y-2">
            <Input className="w-full" name="order_id" label="Order ID" />
            <Button
              variant="secondary"
              className="w-fit self-end whitespace-nowrap"
              type="submit"
              isLoading={isPending}>
              Request transfer
            </Button>
          </div>
        </form>
      </div>
      {!state.success && state.error && (
        <p className="text-base text-right text-rose-500">
          {state.error}
        </p>
      )}
      {showSuccess && (
        <div className="shadow-borders-base flex w-full items-center justify-between self-stretch bg-neutral-50 p-4">
          <div className="flex items-center gap-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <div className="flex flex-col gap-y-1">
              <p className="text-sm font-medium text-neutral-950">
                Transfer for order {state.order?.id} requested
              </p>
              <p className="text-base text-neutral-600">
                Transfer request email sent to {state.order?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-fit"
            onClick={() => setShowSuccess(false)}>
            <XCircle className="h-4 w-4 text-neutral-500" />
          </Button>
        </div>
      )}
    </div>
  )
}

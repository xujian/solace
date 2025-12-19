import React, { useContext, useMemo, type JSX } from 'react'
import { CardElement } from '@stripe/react-stripe-js'
import { StripeCardElementOptions } from '@stripe/stripe-js'
import { isManual } from '@lib/constants'
import { cn } from '@lib/util'
import SkeletonCardDetails from '@modules/skeletons/skeleton-card-details'
import PaymentTest from './payment-test'
import { StripeContext } from './stripe-wrapper'
import { RadioGroupItem } from '@lib/components/ui'

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>
  children?: React.ReactNode
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div
      className={cn(
        'rounded hover:shadow-borders-interactive-with-active',
        'flex cursor-pointer flex-col gap-y-2 border p-4',
        {
          'border-ui-border-interactive':
            selectedPaymentOptionId === paymentProviderId
        }
      )}>
      <div className="flex items-center justify-between gap-2">
        <RadioGroupItem value={paymentProviderId} />
        <h4 className="flex-1">
          {paymentInfoMap[paymentProviderId]?.title || paymentProviderId}
        </h4>
        {paymentInfoMap[paymentProviderId]?.icon}
      </div>
      {children}
    </div>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete
}: Omit<PaymentContainerProps, 'children'> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)
  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: 'Inter, sans-serif',
          color: '#424270',
          '::placeholder': {
            color: 'rgb(107 114 128)'
          }
        }
      },
      classes: {
        base: 'pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out'
      }
    }
  }, [])

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}>
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="transition-all duration-150 ease-in-out">
            <CardElement
              options={useOptions as StripeCardElementOptions}
              onChange={e => {
                setCardBrand(
                  e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
                )
                setError(e.error?.message || null)
                setCardComplete(e.complete)
              }}
            />
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}

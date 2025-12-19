'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Button, RadioGroup } from '@lib/components/ui'
import { Separator } from '@lib/components/ui'
import { initiatePaymentSession } from '@lib/data/cart'
import { isStripeLike, paymentInfoMap } from '@lib/constants'
import { cn } from '@lib/util'
import ErrorMessage from '@modules/checkout/error-message'
import PaymentContainer, {
  StripeCardContainer
} from '@modules/checkout/payment-container'
import { CheckCircle, CreditCard as CreditCardIcon } from 'lucide-react'
import CreditCard from '@modules/payment/credit-card'

const Payment = ({
  cart,
  availablePaymentMethods
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === 'pending'
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    activeSession?.provider_id ?? ''
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + '?' + createQueryString('step', 'payment'), {
      scroll: false
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + '?' + createQueryString('step', 'review'),
          {
            scroll: false
          }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  })

  return (
    <div className="payment">
      <h2>Payment</h2>
      {!paidByGiftcard && availablePaymentMethods?.length && (
        <RadioGroup
          value={selectedPaymentMethod}
          onValueChange={(value: string) => setPaymentMethod(value)}>
          {availablePaymentMethods.map(paymentMethod => (
            <div key={paymentMethod.id}>
              {isStripeLike(paymentMethod.id) ? (
                <StripeCardContainer
                  paymentProviderId={paymentMethod.id}
                  selectedPaymentOptionId={selectedPaymentMethod}
                  paymentInfoMap={paymentInfoMap}
                  setCardBrand={setCardBrand}
                  setError={setError}
                  setCardComplete={setCardComplete}
                />
              ) : (
                <PaymentContainer
                  paymentInfoMap={paymentInfoMap}
                  paymentProviderId={paymentMethod.id}
                  selectedPaymentOptionId={selectedPaymentMethod}
                />
              )}
            </div>
          ))}
        </RadioGroup>
      )}
      {paidByGiftcard && (
        <div className="flex w-1/3 flex-col">
          <p className="txt-medium-plus text-ui-fg-base mb-1">
            Payment method
          </p>
          <p
            className="txt-medium text-ui-fg-subtle"
            data-testid="payment-method-summary">
            Gift card
          </p>
        </div>
      )}
      <ErrorMessage
        error={error}
        data-testid="payment-method-error-message"
      />
      <Button
        className="w-full"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={
          (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
          (!selectedPaymentMethod && !paidByGiftcard)
        }
        data-testid="submit-payment-button">
        {!activeSession && isStripeLike(selectedPaymentMethod)
          ? ' Enter card details'
          : 'Save'}
      </Button>

      {cart && paymentReady && activeSession ? (
        <div className="flex w-full items-start gap-x-1">
          <div className="flex w-1/3 flex-col">
            <p className="txt-medium-plus text-ui-fg-base mb-1">
              Payment method
            </p>
            <p
              className="txt-medium text-ui-fg-subtle"
              data-testid="payment-method-summary">
              {paymentInfoMap[activeSession?.provider_id]?.title ||
                activeSession?.provider_id}
            </p>
          </div>
          <div className="flex w-1/3 flex-col">
            <p className="txt-medium-plus text-ui-fg-base mb-1">
              Payment details
            </p>
            <div
              className="txt-medium text-ui-fg-subtle flex items-center gap-2"
              data-testid="payment-details-summary">
              <div className="bg-ui-button-neutral-hover flex h-7 w-fit items-center p-2">
                {paymentInfoMap[selectedPaymentMethod]?.icon || (
                  <CreditCardIcon />
                )}
              </div>
              <p>
                {isStripeLike(selectedPaymentMethod) && cardBrand
                  ? cardBrand
                  : 'Another step will appear'}
              </p>
            </div>
          </div>
        </div>
      ) : paidByGiftcard ? (
        <div className="flex w-1/3 flex-col">
          <p className="txt-medium-plus text-ui-fg-base mb-1">
            Payment method
          </p>
          <p
            className="txt-medium text-ui-fg-subtle"
            data-testid="payment-method-summary">
            Gift card
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default Payment

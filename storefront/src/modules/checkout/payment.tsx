'use client'

import { Button, RadioGroup } from '@lib/components/ui'
import { isStripeLike, paymentInfoMap } from '@lib/constants'
import { initiatePaymentSession } from '@lib/data/cart'
import ErrorMessage from '@modules/checkout/error-message'
import PaymentContainer, {
  StripeCardContainer
} from '@modules/checkout/payment-container'
import { CreditCard as CreditCardIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

const Payment = ({
  cart,
  methods
}: {
  cart: any
  methods: any[]
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
    console.log('setPaymentMethod------------------------', method)
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
    <section className="payment-section">
      <h2>Payment</h2>
      {
        paidByGiftcard
          ? (
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
            )
          : methods?.length && (
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}>
                {methods.map(paymentMethod => (
                  <div key={paymentMethod.id}
                    onClick={() => setPaymentMethod(paymentMethod.id)}>
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
            )
      }
      <ErrorMessage
        error={error}
        data-testid="payment-method-error-message"
      />
      <Button
        className="w-full mt-4"
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
    </section>
  )
}

export default Payment

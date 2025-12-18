'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, RadioGroup, Separator, RadioGroupItem } from '@lib/components/ui'
import { setShippingMethod } from '@lib/data/cart'
import { calculatePriceForShippingOption } from '@lib/data/fulfillment'
import { convertToLocale } from '@lib/util/money'
import { cn } from '@lib/util'
import ErrorMessage from '@modules/checkout/error-message'
import { ArrowDown, CheckCircle, RefreshCw as Loader } from 'lucide-react'

const PICKUP_OPTION_ON = '__PICKUP_ON'
const PICKUP_OPTION_OFF = '__PICKUP_OFF'

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

function formatAddress(address: HttpTypes.StoreCartAddress) {
  if (!address) {
    return ''
  }

  let ret = ''

  if (address.address_1) {
    ret += ` ${address.address_1}`
  }

  if (address.address_2) {
    ret += `, ${address.address_2}`
  }

  if (address.postal_code) {
    ret += `, ${address.postal_code} ${address.city}`
  }

  if (address.country_code) {
    ret += `, ${address.country_code.toUpperCase()}`
  }

  return ret
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<string>(PICKUP_OPTION_OFF)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | undefined>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || undefined
  )

  const router = useRouter()
  const pathname = usePathname()

  const _shippingMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type !== 'pickup'
  )

  const _pickupMethods = availableShippingMethods?.filter(
    (sm: any) => sm.service_zone?.fulfillment_set?.type === 'pickup'
  )

  const hasPickupOptions = !!_pickupMethods?.length

  useEffect(() => {
    setIsLoadingPrices(true)

    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter(sm => sm.price_type === 'calculated')
        .map(sm => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then(res => {
          const pricesMap: Record<string, number> = {}
          res
            .filter(r => r.status === 'fulfilled')
            .forEach(p => (pricesMap[p.value?.id || ''] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }

    if (_pickupMethods?.find(m => m.id === shippingMethodId)) {
      setShowPickupOptions(PICKUP_OPTION_ON)
    }
  }, [availableShippingMethods])

  const handleEdit = () => {
    router.push(pathname + '?step=delivery', { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + '?step=payment', { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
    variant: 'shipping' | 'pickup'
  ) => {
    setError(null)

    if (variant === 'pickup') {
      setShowPickupOptions(PICKUP_OPTION_ON)
    } else {
      setShowPickupOptions(PICKUP_OPTION_OFF)
    }

    let currentId: string | undefined = undefined
    setIsLoading(true)
    setShippingMethodId(prev => {
      currentId = prev
      return id
    })

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch(err => {
        setShippingMethodId(currentId)

        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  useEffect(() => {
    setError(null)
  })

  return (
    <div className="">
      <div className="mb-6 flex flex-row items-center justify-between">
        <h2
          className={cn('',
            {
              'pointer-events-none opacity-50 select-none':
                cart.shipping_methods?.length === 0
            }
          )}>
          Shipping
        </h2>
      </div>
      <div className="grid" data-testid="delivery-options-container">
        <div className="pt-2 pb-8 md:pt-0">
          {hasPickupOptions && (
            <RadioGroup
              value={showPickupOptions}
              onValueChange={value => {
                const id = _pickupMethods.find(
                  option => !option.insufficient_inventory
                )?.id

                if (id) {
                  handleSetShippingMethod(id, 'pickup')
                }
              }}>
              <div
                data-testid="delivery-option-radio"
                className={cn(
                  'text-small-regular rounded-rounded hover:shadow-borders-interactive-with-active mb-2 flex cursor-pointer items-center justify-between border px-8 py-4',
                  {
                    'border-ui-border-interactive':
                      showPickupOptions === PICKUP_OPTION_ON
                  }
                )}
                onClick={() => {
                  const id = _pickupMethods.find(
                    option => !option.insufficient_inventory
                  )?.id
                  if (id) {
                    handleSetShippingMethod(id, 'pickup')
                  }
                }}>
                <div className="flex items-center gap-x-4">
                  <Radio checked={showPickupOptions === PICKUP_OPTION_ON} />
                  <span className="text-base-regular">
                    Pick up your order
                  </span>
                </div>
                <span className="text-ui-fg-base justify-self-end">-</span>
              </div>
            </RadioGroup>
          )}
          <RadioGroup
            value={shippingMethodId}
            onValueChange={v => {
              if (v) {
                return handleSetShippingMethod(v, 'shipping')
              }
            }}>
            {_shippingMethods?.map(option => {
              const isDisabled =
                option.price_type === 'calculated' &&
                !isLoadingPrices &&
                typeof calculatedPricesMap[option.id] !== 'number'
              return (
                <div
                  key={option.id}
                  data-testid="delivery-option-radio"
                  className={cn(
                    'rounded hover:bg-muted flex cursor-pointer items-center justify-between border px-4 py-4',
                    {
                      'border-ui-border-interactive':
                        option.id === shippingMethodId,
                      'hover:shadow-brders-none cursor-not-allowed':
                        isDisabled
                    }
                  )}
                  onClick={() => {
                    if (!isDisabled && option.id) {
                      handleSetShippingMethod(option.id, 'shipping')
                    }
                  }}>
                  <div className="flex items-center gap-x-4">
                    <RadioGroupItem value={option.id} />
                    <span className="text-base-regular">{option.name}</span>
                  </div>
                  <span className="text-ui-fg-base justify-self-end">
                    {option.price_type === 'flat' ? (
                      convertToLocale({
                        amount: option.amount!,
                        currency_code: cart?.currency_code
                      })
                    ) : calculatedPricesMap[option.id] ? (
                      convertToLocale({
                        amount: calculatedPricesMap[option.id],
                        currency_code: cart?.currency_code
                      })
                    ) : isLoadingPrices ? (
                      <Loader />
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      </div>

      {showPickupOptions === PICKUP_OPTION_ON && (
        <div className="grid">
          <div className="flex flex-col">
            <span className="txt-medium text-ui-fg-base font-medium">
              Store
            </span>
            <span className="text-ui-fg-muted txt-medium mb-4">
              Choose a store near you
            </span>
          </div>
          <div data-testid="delivery-options-container">
            <div className="pt-2 pb-8 md:pt-0">
              <RadioGroup
                value={shippingMethodId}
                onValueChange={v => {
                  if (v) {
                    return handleSetShippingMethod(v, 'pickup')
                  }
                }}>
                {_pickupMethods?.map(option => {
                  return (
                    <div
                      key={option.id}
                      data-testid="delivery-option-radio"
                      className={cn(
                        'text-small-regular rounded-rounded hover:shadow-borders-interactive-with-active mb-2 flex cursor-pointer items-center justify-between border px-8 py-4',
                        {
                          'border-ui-border-interactive':
                            option.id === shippingMethodId,
                          'hover:shadow-brders-none cursor-not-allowed':
                            option.insufficient_inventory
                        }
                      )}
                      onClick={() => {
                        if (!option.insufficient_inventory && option.id) {
                          handleSetShippingMethod(option.id, 'pickup')
                        }
                      }}>
                      <div className="flex items-start gap-x-4">
                        <Radio checked={option.id === shippingMethodId} />
                        <div className="flex flex-col">
                          <span className="text-base-regular">
                            {option.name}
                          </span>
                          <span className="text-base-regular text-ui-fg-muted">
                            {formatAddress(
                              (option as any).service_zone?.fulfillment_set
                                ?.location?.address
                            )}
                          </span>
                        </div>
                      </div>
                      <span className="text-ui-fg-base justify-self-end">
                        {convertToLocale({
                          amount: option.amount!,
                          currency_code: cart?.currency_code
                        })}
                      </span>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          </div>
        </div>
      )}

      <div>
        <ErrorMessage
          error={error}
          data-testid="delivery-option-error-message"
        />
        <Button
          className="w-full"
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!cart.shipping_methods?.[0]}
          data-testid="submit-delivery-option-button">
          <ArrowDown />
          Continue to payment
        </Button>
      </div>
    </div>
  )
}

export default Shipping

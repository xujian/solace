'use client'

import {
  Button,
  RadioGroup,
  RadioGroupItem
} from '@lib/components/ui'
import { setShippingMethod } from '@lib/data/cart'
import { calculatePriceForShippingOption } from '@lib/data/fulfillment'
import { cn } from '@lib/util'
import { convertToLocale } from '@lib/util/money'
import { HttpTypes } from '@medusajs/types'
import ErrorMessage from '@modules/checkout/error-message'
import { ArrowDown, LoaderCircle } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Radio = ({ checked }: { checked: boolean }) => (
  <div
    className={cn(
      'flex h-4 w-4 items-center justify-center rounded-full border border-primary',
      checked ? 'bg-primary' : 'bg-transparent'
    )}>
    {checked && <div className="h-2 w-2 rounded-full bg-white" />}
  </div>
)

type ShippingProps = {
  cart: HttpTypes.StoreCart
  methods: HttpTypes.StoreCartShippingOptionWithServiceZone[] | null
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

const Shipping: React.FC<ShippingProps> = ({ cart, methods }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)

  const [showPickupOptions, setShowPickupOptions] =
    useState<boolean>(false)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [shippingMethodId, setShippingMethodId] = useState<string | undefined>(
    cart.shipping_methods?.at(-1)?.shipping_option_id || undefined
  )
  const [pickupMethodId, setPickupMethodId] = useState<string | undefined>(undefined)
  const [ hasPickupMethods, setHasPickupMethods ] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const getMethodType = (
    method: HttpTypes.StoreCartShippingOptionWithServiceZone
  ) => {
    return method.service_zone.fulfillment_set.type as 'shipping' | 'pickup'
  }

  const genericPickupMethod: HttpTypes.StoreCartShippingOptionWithServiceZone = {
    id: '0',
    name: 'Pickup',
    type: {
      id: '0',
      label: 'Pickup',
      code: 'Pickup',
      description: 'Choose a store near you',
    },
    price_type: 'flat',
    service_zone: {
      // @ts-ignore
      fulfillment_set: {
        id: '0',
        type: 'pickup'
      }
    }
  }

  const mergePickupMethods = (methods: HttpTypes.StoreCartShippingOptionWithServiceZone[]) => {
    const shippingMethods = methods.filter(sm => getMethodType(sm) === 'shipping')
    return [...shippingMethods, genericPickupMethod]
  }

  useEffect(() => {
    setIsLoadingPrices(true)
    if (methods?.length) {
      setHasPickupMethods(methods.filter(sm => getMethodType(sm) === 'pickup').length > 0)
      const promises = methods
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
  }, [methods])

  const handleEdit = () => {
    router.push(pathname + '?step=delivery', { scroll: false })
  }

  const handleSubmit = () => {
    router.push(pathname + '?step=payment', { scroll: false })
  }

  const handleSetShippingMethod = async (
    id: string,
  ) => {
    setError(null)
    let currentId: string | undefined = undefined
    setIsLoading(true)
    setShippingMethodId(prev => {
      currentId = prev
      return id
    })
    if (id === '0') {
      setShowPickupOptions(true)
      setIsLoading(false)
      return
    }
    setShowPickupOptions(false)
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch(err => {
        setShippingMethodId(currentId)
        setError(err.message)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

    const handleSetPickupMethod = async (
    id: string,
  ) => {
    setError(null)
    let currentId: string | undefined = undefined
    setIsLoading(true)
    setPickupMethodId(prev => {
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
    <section className="shipping-section">
      <h2>Shipping</h2>
      <div
        className="grid grid-cols-1 gap-4"
        data-testid="delivery-options-container">
        <RadioGroup
          value={shippingMethodId}
          onValueChange={v => {
            if (v) {
              return handleSetShippingMethod(v)
            }
          }}>
          {mergePickupMethods(methods ?? []).map(method => {
            const isDisabled =
              method.price_type === 'calculated' &&
              !isLoadingPrices &&
              typeof calculatedPricesMap[method.id] !== 'number'
            return (
              <div
                key={method.id}
                data-testid="delivery-method-radio"
                className={cn(
                  'flex cursor-pointer items-start justify-between rounded border px-4 py-4 hover:bg-muted',
                  {
                    'border-ui-border-interactive':
                      method.id === shippingMethodId,
                    'hover:shadow-brders-none cursor-not-allowed': isDisabled
                  }
                )}
                onClick={() => {
                  if (!isDisabled) {
                    handleSetShippingMethod(method.id)
                  }
                }}>
                <div className="flex items-center gap-x-4">
                  <RadioGroupItem value={method.id} />
                  <div className="flex flex-col">
                    <h4 className="text-base-regular">{method.name}</h4>
                    <p className="caption text-sm">{method.type.description}</p>
                  </div>
                </div>
                <span className="text-ui-fg-base justify-self-end">
                  {
                    getMethodType(method) === 'shipping'
                    ? method.price_type === 'flat'
                      ? (
                          convertToLocale({
                            amount: method.amount!,
                            currency_code: cart?.currency_code
                          })
                        ) 
                      : calculatedPricesMap[method.id]
                        ? (
                            convertToLocale({
                              amount: calculatedPricesMap[method.id],
                              currency_code: cart?.currency_code
                            })
                          )
                        : isLoadingPrices
                          ? <LoaderCircle />
                          : ( '-' )
                    : null
                  }
                </span>
              </div>
            )
          })}
        </RadioGroup>
      </div>
      {showPickupOptions && (
        <div className="grid my-2 pl-4">
          <RadioGroup
            value={pickupMethodId}
            onValueChange={v => {
              if (v) {
                return handleSetShippingMethod(v)
              }
            }}>
            {methods?.filter(sm => getMethodType(sm) === 'pickup')?.map(method => {
              return (
                <div
                  key={method.id}
                  data-testid="delivery-method-radio"
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded border px-4 py-4 hover:bg-muted',
                    {
                      'border-ui-border-interactive':
                        method.id === shippingMethodId,
                      'hover:shadow-brders-none cursor-not-allowed':
                        method.insufficient_inventory
                    }
                  )}
                  onClick={() => {
                    if (!method.insufficient_inventory && method.id) {
                      handleSetPickupMethod(method.id)
                    }
                  }}>
                  <div className="flex items-start gap-x-4">
                    <Radio checked={method.id === pickupMethodId} />
                    <div className="flex flex-col">
                      <h4 className="text-base-regular">{method.name}</h4>
                      <p className="caption">
                        {formatAddress(
                          (method as any).service_zone?.fulfillment_set
                            ?.location?.address
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </div>
      )}
      <ErrorMessage error={error} data-testid="delivery-method-error-message" />
      <Button
        className="w-full"
        onClick={handleSubmit}
        isLoading={isLoading}
        disabled={!cart.shipping_methods?.[0]}
        data-testid="submit-delivery-method-button">
        <ArrowDown />
        Continue to payment
      </Button>
    </section>
  )
}

export default Shipping

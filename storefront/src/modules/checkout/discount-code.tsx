'use client'

import React from 'react'
import { HttpTypes } from '@medusajs/types'
import { Badge, Button, Input } from '@lib/components/ui'
import { applyPromotions } from '@lib/data/cart'
import { convertToLocale } from '@lib/util/money'
import ErrorMessage from './error-message'
import { Trash2 as Trash } from 'lucide-react'

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter(
      promotion => promotion.code !== code
    )

    await applyPromotions(
      validPromotions.filter(p => p.code !== undefined).map(p => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage('')

    const code = formData.get('code')
    if (!code) {
      return
    }
    const input = document.getElementById('promotion-input') as HTMLInputElement
    const codes = promotions.filter(p => p.code !== undefined).map(p => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    }

    if (input) {
      input.value = ''
    }
  }

  return (
    <div className="flex w-full flex-col">
      <form action={a => addPromotionCode(a)} className="mb-5 w-full">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          variant="secondary"
          data-testid="add-discount-button">
          Add Promotion Code(s)
        </Button>
        {isOpen && (
          <>
            <div className="flex w-full gap-x-2">
              <Input
                id="promotion-input"
                name="code"
                type="text"
                data-testid="discount-input"
              />
              <Button
                variant="secondary"
                data-testid="discount-apply-button">
                Apply
              </Button>
            </div>
            <ErrorMessage
              error={errorMessage}
              data-testid="discount-error-message"
            />
          </>
        )}
      </form>

      {promotions.length > 0 && (
        <div className="flex w-full items-center">
          <div className="flex w-full flex-col">
            <h3 className="txt-medium mb-2">Promotion(s) applied:</h3>

            {promotions.map(promotion => {
              return (
                <div
                  key={promotion.id}
                  className="mb-2 flex w-full max-w-full items-center justify-between"
                  data-testid="discount-row">
                  <span className="txt-small-plus flex w-4/5 items-baseline gap-x-1 pr-1">
                    <span className="truncate" data-testid="discount-code">
                      <Badge
                        variant={
                          promotion.is_automatic ? 'secondary' : 'default'
                        }
                        className="text-xs">
                        {promotion.code}
                      </Badge>{' '}
                      (
                      {promotion.application_method?.value !== undefined &&
                        promotion.application_method.currency_code !==
                          undefined && (
                          <>
                            {promotion.application_method.type ===
                            'percentage'
                              ? `${promotion.application_method.value}%`
                              : convertToLocale({
                                  amount: +promotion.application_method.value,
                                  currency_code:
                                    promotion.application_method.currency_code
                                })}
                          </>
                        )}
                      )
                      {/* {promotion.is_automatic && (
                        <Tooltip content="This promotion is automatically applied">
                          <InformationCircleSolid className="inline text-zinc-400" />
                        </Tooltip>
                      )} */}
                    </span>
                  </span>
                  {!promotion.is_automatic && (
                    <button
                      className="flex items-center"
                      onClick={() => {
                        if (!promotion.code) {
                          return
                        }

                        removePromotionCode(promotion.code)
                      }}
                      data-testid="remove-discount-button">
                      <Trash size={14} />
                      <span className="sr-only">
                        Remove discount code from order
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode

import React, { useMemo } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Button, Dialog, DialogContent } from '@lib/components/ui'
import useToggleState from '@lib/hooks/use-toggle-state'
import { getProductPrice } from '@lib/util/get-product-price'
import { isSimpleProduct } from '@lib/util/product'
import { cn } from '@lib/util'
import OptionSelect from './option-select'
import { ChevronDown, X } from 'lucide-react'
import { VariantColor } from 'types/cms'

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  colors: VariantColor[]
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const MobileActions: React.FC<MobileActionsProps> = ({
  product,
  variant,
  options,
  colors,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id
  })

  const selectedPrice = useMemo(() => {
    if (!price) {
      return null
    }
    const { variantPrice, cheapestPrice } = price

    return variantPrice || cheapestPrice || null
  }, [price])

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={cn(
          'product-actions-mobile fixed inset-x-0 bottom-0 z-50',
          'transition-opacity duration-300 md:hidden',
          {
            'pointer-events-none opacity-0': !show,
            'opacity-100': show
          }
        )}>
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-y-3 bg-gray-400 bg-blend-overlay p-4"
          data-testid="mobile-actions">
          <div className="flex items-center gap-x-2">
            <span data-testid="mobile-title">{product.title}</span>
            <span>—</span>
            {selectedPrice ? (
              <div className="text-ui-fg-base flex items-end gap-x-2">
                {selectedPrice.price_type === 'sale' && (
                  <p>
                    <span className="text-small-regular line-through">{selectedPrice.original_price}</span>
                  </p>
                )}
                <span
                  className={cn({
                    'text-ui-fg-interactive': selectedPrice.price_type === 'sale'
                  })}>
                  {selectedPrice.calculated_price}
                </span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div
            className={cn('grid w-full grid-cols-2 gap-x-4', {
              'grid-cols-1!': isSimple
            })}>
            {!isSimple && (
              <Button onClick={open} variant="secondary" className="w-full" data-testid="mobile-actions-button">
                <div className="flex w-full items-center justify-between">
                  <span>{variant ? Object.values(options).join(' / ') : 'Select Options'}</span>
                  <ChevronDown />
                </div>
              </Button>
            )}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || !variant}
              className="w-full"
              isLoading={isAdding}
              data-testid="mobile-cart-button">
              {!variant ? 'Select variant' : !inStock ? 'Out of stock' : 'Add to cart'}
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={state} onOpenChange={open => !open && close()}>
        <DialogContent
          className="flex h-auto max-h-[90vh] w-full flex-col gap-y-3 overflow-hidden p-0 sm:max-w-lg"
          data-testid="mobile-actions-modal"
          onInteractOutside={close}>
          <div className="flex w-full justify-end pt-6 pr-6">
            <button
              onClick={close}
              className="text-ui-fg-base flex h-12 w-12 items-center justify-center rounded-full bg-white hover:bg-gray-100"
              data-testid="close-modal-button">
              <X />
            </button>
          </div>
          <div className="overflow-y-auto bg-white px-6 pb-12">
            {(product.variants?.length ?? 0) > 1 && (
              <div className="flex flex-col gap-y-6">
                {(product.options || []).map(option => {
                  return (
                    <div key={option.id}>
                      <OptionSelect
                        option={option}
                        colors={colors}
                        current={options[option.id]}
                        updateOption={updateOptions}
                        title={option.title ?? ''}
                        disabled={optionsDisabled}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default MobileActions

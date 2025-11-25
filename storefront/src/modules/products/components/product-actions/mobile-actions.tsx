import { Button, Dialog, DialogContent } from "@lib/components/ui"
import { cn } from "@lib/util"
import React, { useMemo } from "react"

import useToggleState from "@lib/hooks/use-toggle-state"
import ChevronDown from "@modules/common/icons/chevron-down"
import X from "@modules/common/icons/x"

import { getProductPrice } from "@lib/util/get-product-price"
import OptionSelect from "./option-select"
import { HttpTypes } from "@medusajs/types"
import { isSimpleProduct } from "@lib/util/product"

type MobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
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
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const price = getProductPrice({
    product: product,
    variantId: variant?.id,
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
        className={cn("lg:hidden inset-x-0 bottom-0 fixed z-50 transition-opacity duration-300", {
          "opacity-0 pointer-events-none": !show,
          "opacity-100": show,
        })}
      >
        <div
          className="bg-white flex flex-col gap-y-3 justify-center items-center text-large-regular p-4 h-full w-full border-t border-gray-200"
          data-testid="mobile-actions"
        >
          <div className="flex items-center gap-x-2">
            <span data-testid="mobile-title">{product.title}</span>
            <span>—</span>
            {selectedPrice ? (
              <div className="flex items-end gap-x-2 text-ui-fg-base">
                {selectedPrice.price_type === "sale" && (
                  <p>
                    <span className="line-through text-small-regular">
                      {selectedPrice.original_price}
                    </span>
                  </p>
                )}
                <span
                  className={cn({
                    "text-ui-fg-interactive":
                      selectedPrice.price_type === "sale",
                  })}
                >
                  {selectedPrice.calculated_price}
                </span>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className={cn("grid grid-cols-2 w-full gap-x-4", {
            "grid-cols-1!": isSimple
          })}>
            {!isSimple && <Button
              onClick={open}
              variant="secondary"
              className="w-full"
              data-testid="mobile-actions-button"
            >
              <div className="flex items-center justify-between w-full">
                <span>
                  {variant
                    ? Object.values(options).join(" / ")
                    : "Select Options"}
                </span>
                <ChevronDown />
              </div>
            </Button>}
            <Button
              onClick={handleAddToCart}
              disabled={!inStock || !variant}
              className="w-full"
              isLoading={isAdding}
              data-testid="mobile-cart-button"
            >
              {!variant
                ? "Select variant"
                : !inStock
                ? "Out of stock"
                : "Add to cart"}
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={state} onOpenChange={(open) => !open && close()}>
        <DialogContent
          className="w-full h-auto max-h-[90vh] overflow-hidden flex flex-col gap-y-3 p-0 sm:max-w-lg"
          data-testid="mobile-actions-modal"
          onInteractOutside={close}
        >
          <div className="w-full flex justify-end pr-6 pt-6">
            <button
              onClick={close}
              className="bg-white w-12 h-12 rounded-full text-ui-fg-base flex justify-center items-center hover:bg-gray-100"
              data-testid="close-modal-button"
            >
              <X />
            </button>
          </div>
          <div className="bg-white px-6 pb-12 overflow-y-auto">
            {(product.variants?.length ?? 0) > 1 && (
              <div className="flex flex-col gap-y-6">
                {(product.options || []).map((option) => {
                  return (
                    <div key={option.id}>
                      <OptionSelect
                        option={option}
                        current={options[option.id]}
                        updateOption={updateOptions}
                        title={option.title ?? ""}
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

'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { isEqual } from 'lodash'
import { HttpTypes } from '@medusajs/types'
import { Button } from '@lib/components/ui'

import { useIntersection } from '@lib/hooks/use-in-view'
import OptionSelect from '@modules/products/option-select'
import ProductPrice from './product-price'
import { VariantColor } from 'types/cms'
import { useCart } from '@lib/context/cart-context'

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  colors: VariantColor[]
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant['options']) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({ product, colors, disabled }: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const cart = useCart()
  // If there is only 1 variant, preselect the options
  useEffect(() => {
    if (product.variants?.length) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return undefined
    }
    return product.variants.find(v => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // update the options when a variant is selected
  const setOptionValue = (optionId: string, value: string) => {
    setOptions(prev => ({
      ...prev,
      [optionId]: value
    }))
  }

  //check if the selected options produce a valid variant
  const isValidVariant = useMemo(() => {
    return product.variants?.some(v => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    // If we allow back orders on the variant, we can add to cart
    if (selectedVariant?.allow_backorder) {
      return true
    }
    // If there is inventory available, we can add to cart
    if (selectedVariant?.manage_inventory && (selectedVariant?.inventory_quantity || 0) > 0) {
      return true
    }
    // Otherwise, we can't add to cart
    return false
  }, [selectedVariant])
  const actionsRef = useRef<HTMLDivElement>(null)
  // const inView = useIntersection(actionsRef, '0px')
  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await cart.add({
      variant: selectedVariant.id,
      quantity: 1
    })
    setIsAdding(false)
  }

  return (
    <div className="flex flex-col gap-y-2" ref={actionsRef}>
      [{isValidVariant}]
      <div>
        {(product.variants?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map(option => (
              <OptionSelect
                key={option.id}
                option={option}
                colors={colors}
                current={options[option.id]}
                updateOption={setOptionValue}
                title={option.title ?? ''}
                data-testid={`product-options`}
                disabled={!!disabled || isAdding}
              />
            ))}
          </div>
        )}
      </div>
      <ProductPrice product={product} variant={selectedVariant} />
      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant}
        variant="outline"
        className="bg-positive w-full"
        isLoading={isAdding}
        data-testid="add-product-button">
        {!selectedVariant && !options
          ? 'Select variant'
          : !inStock || !isValidVariant
            ? 'Out of stock'
            : 'Add to cart'}
      </Button>
      <p>&nbsp;</p>
    </div>
  )
}

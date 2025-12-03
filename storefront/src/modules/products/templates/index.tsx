import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta'
import ProductTabs from '@modules/products/components/product-tabs'
import RelatedProducts from '@modules/products/components/related-products'
import ProductInfo from '@modules/products/templates/product-info'
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products'
import ProductActionsWrapper from './product-actions-wrapper'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, images }) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container small:flex-row small:items-start relative flex flex-col py-6"
        data-testid="product-container">
        <div className="small:sticky small:top-48 small:py-0 small:max-w-[300px] flex w-full flex-col gap-y-6 py-8">
          <ProductInfo product={product} />
          <ProductTabs product={product} />
        </div>
        <div className="relative block w-full">
          <ImageGallery images={images} />
        </div>
        <div className="small:sticky small:top-48 small:py-0 small:max-w-[300px] flex w-full flex-col gap-y-12 py-8">
          <ProductOnboardingCta />
          <Suspense fallback={<ProductActions disabled={true} product={product} />}>
            <ProductActionsWrapper id={product.id} />
          </Suspense>
        </div>
      </div>
      <div className="content-container small:my-32 my-16" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate

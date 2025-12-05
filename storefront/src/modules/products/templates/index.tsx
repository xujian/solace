import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import ImageGallery from '@modules/products/components/image-gallery'
import ProductActions from '@modules/products/components/product-actions'
import ProductOnboardingCta from '@modules/products/components/product-onboarding-cta'
import ProductTabs from '@modules/products/components/product-details'
import RelatedProducts from '@modules/products/components/related-products'
import SkeletonRelatedProducts from '@modules/skeletons/templates/skeleton-related-products'
import ProductActionsWrapper from './product-actions-wrapper'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { Badge } from '@lib/components/ui'
import ProductDetails from '@modules/products/components/product-details'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@lib/components/ui/breadcrumb'

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, images }) => {

  console.log('+++++++++++++++++++++product', product)
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="product-view flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/categories/${product.categories?.[0].handle}`}>{product.categories?.[0].name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>   
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageGallery images={images} />
        <div className="attributes flex-col gap-6" data-testid="product-container">
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle">
              <Badge className='bg-amber-600 text-white hover:bg-amber-700 hover:border-white'>{product.collection.title}</Badge>
            </LocalizedClientLink>
          )}
          <h1 data-testid="product-title">
            {product.title}
          </h1>
          <Suspense fallback={<ProductActions disabled={true} product={product} colors={[]} />}>
            <ProductActionsWrapper id={product.id} />
          </Suspense>
          <p className="text-medium text-ui-fg-subtle whitespace-pre-line" data-testid="product-description">
            {product.description}
          </p>
          <p>&nbsp;</p>
          <ProductDetails product={product} />
          <ProductOnboardingCta />
        </div>
      </div>
      <div className="sm:my-32 my-16" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate

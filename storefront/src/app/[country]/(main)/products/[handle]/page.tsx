import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import { HttpTypes } from '@medusajs/types'
import { Badge } from '@lib/components/ui'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@lib/components/ui/breadcrumb'
import { getVariantColors } from '@lib/data/cms'
import {
  listProducts,
  retrieveProductByHandle,
  retrieveProduct
} from '@lib/data/products'
import { listCountries } from '@lib/data/regions'
import repeat from '@lib/util/repeat'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import ImageGallery from '@modules/products/image-gallery'
import ProductActions from '@modules/products/product-actions'
import ProductDetails from '@modules/products/product-details'
import ProductOnboardingCta from '@modules/products/product-onboarding-cta'
import RelatedProducts from '@modules/products/related-products'
import SkeletonProductPreview from '@modules/skeletons/skeleton-product-preview'

type Props = {
  params: Promise<{ country: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countries = await listCountries()

    if (!countries) {
      return []
    }

    const countryProducts = await Promise.all(
      countries.map(async country => {
        const { response } = await listProducts({
          country,
          queryParams: { limit: 100, fields: 'handle' }
        })

        return {
          country,
          products: response.products
        }
      })
    )

    return countryProducts
      .flatMap(c =>
        c.products.map(product => ({
          country: c.country,
          handle: product.handle
        }))
      )
      .filter(param => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${error instanceof Error ? error.message : 'Unknown error'}.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find(v => v.id === selectedVariantId)
  if (!variant || !variant.images.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map(i => [i.id, true]))
  return product.images!.filter(i => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle } = await props.params

  const product = await listProducts({
    queryParams: { handle }
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : []
    }
  }
}

const SkeletonRelatedProducts = () => {
  return (
    <div className="product-page-constraint">
      <div className="mb-8 flex flex-col items-center gap-8 text-center">
        <div className="h-6 w-20 animate-pulse bg-gray-100"></div>
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-96 animate-pulse bg-gray-100"></div>
          <div className="h-10 w-48 animate-pulse bg-gray-100"></div>
        </div>
      </div>
      <ul className="small:grid-cols-3 medium:grid-cols-4 grid flex-1 grid-cols-2 gap-x-6 gap-y-8">
        {repeat(3).map(index => (
          <li key={index}>
            <SkeletonProductPreview />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function ProductPage(props: Props) {
  const { handle } = await props.params
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  const product = await retrieveProductByHandle(handle)

  if (!product || !product.id) {
    return notFound()
  }

  const images = product
    ? getImagesForVariant(product, selectedVariantId) || []
    : []

  const variantColors = await getVariantColors()

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
            <BreadcrumbLink
              href={`/categories/${product.categories?.[0].handle}`}>
              {product.categories?.[0].name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ImageGallery images={images} />
        <div
          className="attributes flex-col gap-6"
          data-testid="product-container">
          {product.collection && (
            <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle">
              <Badge className="bg-amber-600 text-white hover:border-white hover:bg-amber-700">
                {product.collection.title}
              </Badge>
            </LocalizedClientLink>
          )}
          <h1 data-testid="product-title">{product.title}</h1>
          <Suspense
            fallback={
              <ProductActions disabled={true} product={product} colors={[]} />
            }>
            <ProductActions product={product} colors={variantColors} />
          </Suspense>
          <p
            className="text-medium text-ui-fg-subtle whitespace-pre-line"
            data-testid="product-description">
            {product.description}
          </p>
          <p>&nbsp;</p>
          <ProductDetails product={product} />
          <ProductOnboardingCta />
        </div>
      </div>
      <div className="my-16 sm:my-32" data-testid="related-products-container">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} />
        </Suspense>
      </div>
    </div>
  )
}

'use client'

import { HttpTypes } from '@medusajs/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@lib/components/ui'
import { ArrowLeft as Back } from 'lucide-react'
import { Truck as FastDelivery } from 'lucide-react'
import { RefreshCw as Refresh } from 'lucide-react'

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: 'Product Information',
      component: <ProductInfoTab product={product} />
    },
    {
      label: 'Shipping & Returns',
      component: <ShippingInfoTab />
    }
  ]

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border border-gray-500 rounded overflow-hidden"
      defaultValue="item-1"
    >
      {tabs.map((tab, i) => (
        <AccordionItem key={i} title={tab.label} value={tab.label} className='border-gray-500 last:border-b-0' >
          <AccordionTrigger className='px-4 hover:no-underline hover:bg-gray-500 cursor-pointer transition-background duration-500'>{tab.label}</AccordionTrigger>
          <AccordionContent className='px-4'>{tab.component}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-sm py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : '-'}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : '-'}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : '-'}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : '-'}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-sm py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Refresh />
          <div>
            <span className="font-semibold">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No questions asked – we&apos;ll do our best to
              make sure your return is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs

import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui'
import { convertToLocale } from '@lib/util/money'
import { HttpTypes } from '@medusajs/types'
import { MapPin, Phone, Truck } from 'lucide-react'

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted">
          <CardHeader>
            <MapPin />
            <CardTitle className="text-muted-foreground text-sm">Shipping Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              {order.shipping_address?.first_name}{' '}
              {order.shipping_address?.last_name}
            </p>
            <p className="">
              {order.shipping_address?.address_1}{' '}
              {order.shipping_address?.address_2}
            </p>
            <p className="">
              {order.shipping_address?.postal_code},{' '}
              {order.shipping_address?.city}
            </p>
            <p className="">
              {order.shipping_address?.country_code?.toUpperCase()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardHeader>
            <Phone />
            <CardTitle className="text-muted-foreground text-sm">Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              {order.shipping_address?.phone}
            </p>
            <p className="">{order.email}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted">
          <CardHeader>
            <Truck />
            <CardTitle className="text-muted-foreground text-sm">Method</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="">
              {(order as any).shipping_methods[0]?.name} (
              {convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code
              })}
              )
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default ShippingDetails

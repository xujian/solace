import { Badge, Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui'
import { HttpTypes } from '@medusajs/types'

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split('_').join(' ')
    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  const facts = [
    {
      label: 'Order date',
      value: new Date(order.created_at).toDateString()
    },
    {
      label: 'Order number',
      value: order.display_id
    },
    {
      label: 'Order status',
      value: formatStatus(order.fulfillment_status)
    },
    {
      label: 'Payment status',
      value: formatStatus(order.payment_status)
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {facts.map((fact, index) => (
        <Card key={index}>
          <CardHeader className="p-4">
            <CardTitle className="text-muted-foreground text-sm">{fact.label}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Badge>{fact.value}</Badge>
        </CardContent>
      </Card>)
      )}
    </div>
  )
}

export default OrderDetails

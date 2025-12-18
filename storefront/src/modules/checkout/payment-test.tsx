import { Badge } from '@lib/components/ui'

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <Badge variant="destructive" className={className}>
      <span className="font-semibold">Attention:</span> For testing purposes
      only.
    </Badge>
  )
}

export default PaymentTest

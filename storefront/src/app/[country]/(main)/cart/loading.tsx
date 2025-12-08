import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow
} from '@lib/components/ui'
import repeat from '@lib/util/repeat'
import SkeletonCartItem from '@modules/skeletons/skeleton-cart-item'
import SkeletonCodeForm from '@modules/skeletons/skeleton-code-form'
import SkeletonOrderSummary from '@modules/skeletons/skeleton-order-summary'

export default function Loading() {
  return (
    <div className="py-12">
      <div className="content-container">
        <div className="small:grid-cols-[1fr_360px] grid grid-cols-1 gap-x-40">
          <div className="flex flex-col gap-y-6 bg-white p-6">
            <div className="flex items-start justify-between bg-white">
              <div className="flex flex-col gap-y-2">
                <div className="h-8 w-60 animate-pulse bg-gray-200" />
                <div className="h-6 w-48 animate-pulse bg-gray-200" />
              </div>
              <div>
                <div className="h-8 w-14 animate-pulse bg-gray-200" />
              </div>
            </div>
            <div>
              <div className="flex items-center pb-3">
                <div className="h-12 w-20 animate-pulse bg-gray-200" />
              </div>
              <Table>
                <TableHeader className="border-t-0">
                  <TableRow>
                    <TableHead className="pl-0!">
                      <div className="h-6 w-10 animate-pulse bg-gray-200" />
                    </TableHead>
                    <TableHead></TableHead>
                    <TableHead>
                      <div className="h-6 w-16 animate-pulse bg-gray-200" />
                    </TableHead>
                    <TableHead>
                      <div className="h-6 w-12 animate-pulse bg-gray-200" />
                    </TableHead>
                    <TableHead className="pr-0!">
                      <div className="flex justify-end">
                        <div className="h-6 w-12 animate-pulse bg-gray-200" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {repeat(4).map(index => (
                    <SkeletonCartItem key={index} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col gap-y-8">
            <SkeletonOrderSummary />
            <SkeletonCodeForm />
          </div>
        </div>
      </div>
    </div>
  )
}

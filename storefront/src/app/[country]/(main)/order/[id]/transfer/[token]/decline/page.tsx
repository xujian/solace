import { declineTransferRequest } from '@lib/data/orders'
import TransferImage from '@modules/order/transfer-image'

export default async function TransferPage({ params }: { params: { id: string; token: string } }) {
  const { id, token } = params

  const { success, error } = await declineTransferRequest(id, token)

  return (
    <div className="mx-auto mt-10 mb-20 flex w-2/5 flex-col items-start gap-y-4">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <h1 className="text-xl text-zinc-900">Order transfer declined!</h1>
            <p className="text-zinc-600">Transfer of order {id} has been successfully declined.</p>
          </>
        )}
        {!success && (
          <>
            <p className="text-zinc-600">There was an error declining the transfer. Please try again.</p>
            {error && <p className="text-red-500">Error message: {error}</p>}
          </>
        )}
      </div>
    </div>
  )
}

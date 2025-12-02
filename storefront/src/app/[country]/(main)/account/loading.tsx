import { RefreshCw as Spinner } from 'lucide-react'

export default function Loading() {
  return (
    <div className="text-ui-fg-base flex h-full w-full items-center justify-center">
      <Spinner size={36} />
    </div>
  )
}

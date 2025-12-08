import { useState } from 'react'
import { Button } from '@lib/components/ui'
import { deleteLineItem } from '@lib/data/cart'
import { cn } from '@lib/util'
import { RefreshCw as Spinner, X } from 'lucide-react'

const DeleteButton = ({
  id,
  children,
  className
}: {
  id: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    await deleteLineItem(id).catch(err => {
      setIsDeleting(false)
    })
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className="bg-negtive cursor-pointer gap-x-1"
      onClick={() => handleDelete(id)}>
      {isDeleting ? <Spinner className="animate-spin" /> : <X />}
    </Button>
  )
}

export default DeleteButton
